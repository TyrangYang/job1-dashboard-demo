import { createContext, useContext, useEffect, useState } from 'react';
import type { FC, Dispatch, SetStateAction, PropsWithChildren } from 'react';
import { useDataContext } from '../../context/DataProvider';

export interface OptionsBasic {
  label: string;
  value: string;
}

interface ContextType {
  filterKey: string;
  selectedValue: string[];
  addSelectedValue: (key: string) => void;
  removeSelectedValue: (key: string) => void;
}
const FilterContext = createContext<ContextType | undefined>(undefined);

interface Props extends PropsWithChildren {
  filterKey: string;
  options: OptionsBasic[];
}

const FilterProvider: FC<Props> = ({ filterKey, options, children }) => {
  // this design is just for mimic mobx. Not necessary

  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const { setSelectedFilterOptions } = useDataContext();

  useEffect(() => {
    setSelectedFilterOptions({ field: filterKey, value: selectedValue });
  }, [selectedValue, filterKey, setSelectedFilterOptions]);

  return (
    <FilterContext.Provider
      value={{
        filterKey,
        selectedValue,
        addSelectedValue: (key) => {
          setSelectedValue((prev) => [...prev, key]);
        },
        removeSelectedValue(key) {
          setSelectedValue((prev) => prev.filter((e) => e !== key));
        },
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
