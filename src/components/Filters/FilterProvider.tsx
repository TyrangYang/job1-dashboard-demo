import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import type { FC, PropsWithChildren, ActionDispatch } from 'react';
import { useDataContext } from '../../context/DataProvider';

export interface OptionsBasic {
  label: string;
  value: string;
}

interface ContextType {
  filterKey: string;
  selectedValue: string[];
  isAllSelected: boolean;
  options: (OptionsBasic & { isSelected: boolean })[];
  dispatchOptionSelectedStatus: ActionDispatch<[ActionType]>;
}
const FilterContext = createContext<ContextType | undefined>(undefined);

interface Props extends PropsWithChildren {
  filterKey: string;
  options: OptionsBasic[];
}

type ActionType =
  | { type: 'toggle'; optionKey: string }
  | { type: 'cleanAll' }
  | { type: 'selectAll' };

const FilterProvider: FC<Props> = ({ filterKey, options, children }) => {
  // this design is just for mimic mobx. Not necessary

  const { setSelectedFilterOptions } = useDataContext();

  // reduce mimic @action. status(allOptions) mimic @observable
  const [allOptions, dispatchOptionSelectedStatus] = useReducer<
    (OptionsBasic & { isSelected: boolean })[],
    [ActionType]
  >(
    (prevOptions, action) => {
      if (action.type === 'toggle') {
        const target = prevOptions.find(
          (option) => option.value === action.optionKey,
        );
        if (target) {
          target.isSelected = !target.isSelected;
        }
        console.log({ prevOptions });
        return [...prevOptions];
      } else if (action.type === 'selectAll') {
        return prevOptions.map((option) => ({ ...option, isSelected: true }));
      } else {
        return prevOptions.map((option) => ({ ...option, isSelected: false }));
      }
    },
    options.map((e) => ({ ...e, isSelected: false })),
  );

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
