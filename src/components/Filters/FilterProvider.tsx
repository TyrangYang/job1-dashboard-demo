import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import type { FC, PropsWithChildren, ActionDispatch } from 'react';
import { useDataContext } from '../../context/DataProvider';
import { fetchFilterOptions } from '../../fetchData';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import { useCascadeFilterController } from './CascadeControllerProvider';

export interface OptionsBasic {
  label: string;
  value: string;
}

interface ContextType {
  loading: boolean;
  filterKey: string;
  selectedValue: string[];
  isAllSelected: boolean;
  // fetchOptions: (extraFilters?: {}, selected?: string[]) => Promise<void>;
  options: (OptionsBasic & { isSelected: boolean })[];
  dispatchOptionSelectedStatus: ActionDispatch<[ActionType]>;
}
const FilterContext = createContext<ContextType | undefined>(undefined);

interface Props extends PropsWithChildren {
  filterKey: string;
}

type ActionType =
  | { type: 'toggle'; optionKey: string }
  | { type: 'init'; options: OptionsBasic[]; selected?: string[] }
  | { type: 'cleanAll' }
  | { type: 'selectAll' };

const FilterProvider: FC<Props> = ({ filterKey, children }) => {
  // this design is just for mimic mobx. Not necessary

  const { setSelectedFilterOptions } = useDataContext();
  const controller = useCascadeFilterController();

  const [loading, setLoading] = useState(true);

  // reduce mimic @action. status(allOptions) mimic @observable
  const [allOptions, dispatchOptionSelectedStatus] = useReducer<
    (OptionsBasic & { isSelected: boolean })[],
    [ActionType]
  >((prevOptions, action) => {
    switch (action.type) {
      case 'toggle':
        return prevOptions.map((option) =>
          option.value === action.optionKey
            ? { ...option, isSelected: !option.isSelected }
            : option,
        );
      case 'selectAll':
        return prevOptions.map((option) => ({ ...option, isSelected: true }));
      case 'cleanAll':
        return prevOptions.map((option) => ({
          ...option,
          isSelected: false,
        }));
      case 'init':
        return action.options.map((e) => {
          if (action.selected?.includes(e.value)) {
            return { ...e, isSelected: true };
          }
          return { ...e, isSelected: false };
        });

      default:
        return prevOptions;
    }
  }, []);

  const currentRequestRef = useRef<symbol | null>(null);
  const fetchOptions = useCallback(
    async (extraFilters = {}, selected: string[] = []) => {
      const requestId = Symbol();
      currentRequestRef.current = requestId;

      setLoading(true);

      const options = await fetchFilterOptions({
        target: filterKey,
        filters: extraFilters,
      });

      if (currentRequestRef.current !== requestId) return; // prevent competing

      dispatchOptionSelectedStatus({
        type: 'init',
        options: options.map((e) => ({ label: e, value: e })),
        selected,
      });

      setLoading(false);
    },
    [filterKey],
  );

  useEffect(() => {
    controller.register(filterKey, {
      fetchOptions,
      reset: () => dispatchOptionSelectedStatus({ type: 'cleanAll' }),
    });

    fetchOptions(); // init fetch

    return () => {
      controller.unregister(filterKey);
    };
  }, [controller, fetchOptions, filterKey]);

  const isAllSelected = useMemo(() => {
    return allOptions.every((e) => e.isSelected);
  }, [allOptions]);

  // mimic @computed
  const selectedValue = useMemo(() => {
    return allOptions.filter((option) => option.isSelected).map((e) => e.value);
  }, [allOptions]);

  // useUpdateEffect(() => {
  //   controller.triggerFetch(filterKey, { [filterKey]: selectedValue });
  // }, [selectedValue, controller, filterKey]);

  // for Table only
  useEffect(() => {
    setSelectedFilterOptions({ field: filterKey, value: selectedValue });
  }, [selectedValue, filterKey, setSelectedFilterOptions]);

  return (
    <FilterContext.Provider
      value={{
        loading,
        filterKey,
        selectedValue,
        isAllSelected,
        options: allOptions,
        dispatchOptionSelectedStatus,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error('Filter Provider init failed');
  return context;
};

export default FilterProvider;
