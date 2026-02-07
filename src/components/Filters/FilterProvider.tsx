import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import type { FC, PropsWithChildren, ActionDispatch } from 'react';
import { useDataContext } from '../../context/DataProvider';
import { fetchFilterOptions } from '../../fetchData';

export interface OptionsBasic {
  label: string;
  value: string;
}

interface ContextType {
  loading: boolean;
  filterKey: string;
  selectedValue: string[];
  isAllSelected: boolean;
  options: (OptionsBasic & { isSelected: boolean })[];
  dispatchOptionSelectedStatus: ActionDispatch<[ActionType]>;
}
const FilterContext = createContext<ContextType | undefined>(undefined);

interface Props extends PropsWithChildren {
  filterKey: string;
}

type ActionType =
  | { type: 'toggle'; optionKey: string }
  | { type: 'init'; options: OptionsBasic[] }
  | { type: 'cleanAll' }
  | { type: 'selectAll' };

const FilterProvider: FC<Props> = ({ filterKey, children }) => {
  // this design is just for mimic mobx. Not necessary

  const { setSelectedFilterOptions } = useDataContext();
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
        console.log(action.options);
        return action.options.map((e) => ({ ...e, isSelected: false }));

      default:
        return prevOptions;
    }
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const options = await fetchFilterOptions({
        target: filterKey,
        filters: {},
      });

      dispatchOptionSelectedStatus({
        type: 'init',
        options: options.map((e) => ({ label: e, value: e })),
      });
      setLoading(false);
    };
    fetch();
  }, []);

  const isAllSelected = useMemo(() => {
    return allOptions.every((e) => e.isSelected);
  }, [allOptions]);

  // mimic @computed
  const selectedValue = useMemo(() => {
    return allOptions.filter((option) => option.isSelected).map((e) => e.value);
  }, [allOptions]);

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
        dispatchOptionSelectedStatus: dispatchOptionSelectedStatus,
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
