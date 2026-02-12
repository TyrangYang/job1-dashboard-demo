import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { normalizedData, NormalizedDataType } from '../normalizedData';
import { DataType, fetchData } from '../fetchData';
import { normalizedOption } from '../normalizedOptions';

interface Props extends PropsWithChildren {}

type SetSelectedFilterOptionsActionType = {
  field: string;
  value: string[];
};

type DataContextType = {
  data: NormalizedDataType[];
  oriData: DataType[];
  allAvailableDimension: string[];
  selectedFilterOptions: Record<string, string[]>;
  setSelectedFilterOptions: React.ActionDispatch<
    [SetSelectedFilterOptionsActionType]
  >;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProvider: FC<Props> = ({ children }) => {
  const [data, setData] = useState<DataType[]>([]);

  const [selectedFilterOptions, setSelectedFilterOptions] = useReducer<
    Record<string, string[]>,
    [SetSelectedFilterOptionsActionType]
  >((filters, action) => {
    return {
      ...filters,
      [action.field]: action.value,
    };
  }, {});

  const normalizedD = useMemo<NormalizedDataType[]>(() => {
    return normalizedData(data, selectedFilterOptions);
  }, [data, selectedFilterOptions]);

  const allAvailableDimension = useMemo<string[]>(() => {
    return Object.keys(selectedFilterOptions).filter(
      (key) => selectedFilterOptions[key].length !== 0,
    );
  }, [selectedFilterOptions]);

  useEffect(() => {
    const fetch = async () => {
      const fetchedData = await fetchData();

      // console.log(allPossibleFilterOptions);
      // setAllDimension(dimensions);
      setData(fetchedData);
    };
    fetch();
  }, []);
  return (
    <DataContext.Provider
      value={{
        data: normalizedD,
        oriData: data,
        allAvailableDimension,
        selectedFilterOptions,
        setSelectedFilterOptions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined)
    throw new Error('useDataContext must be used within a DataProvider');
  return context;
};

export default DataProvider;
