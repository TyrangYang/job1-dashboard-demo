import papa from 'papaparse';
import { filteringData } from './normalizedData';
export type RawDataType = {
  COMMIT_CD: string;
  EVENT_ID: string;
  EVENT_NAME: string;
  EVENT_START_TS_PT: string;
  LOB: string;
  SUB_LOB: string;
  GEO: string;
  SALES_ORG_CD: string;
  COUNTRY: string;
  PROGRAM_CD: string;
  AOS_ORDERS_PLACED: string;
  AOS_ORDERS_CANCELLED: string;
  SAP_ORDERS_INDUCTED: string;
};

export const OptionsFields = [
  'LOB',
  'SUB_LOB',
  'GEO',
  'SALES_ORG_CD',
  'COUNTRY',
  'COMMIT_CD',
  'PROGRAM_CD',
] as const;

export const DataFields = [
  'AOS_ORDERS_PLACED',
  'AOS_ORDERS_CANCELLED',
  'SAP_ORDERS_INDUCTED',
] as const;

const NeededFields = [...OptionsFields, ...DataFields];

// pending = placed - cancelled - inducted
type NeededFieldsKeys = (typeof NeededFields)[number];

export type DataType = Pick<RawDataType, NeededFieldsKeys>;

export const fetchData = async () => {
  const response = await fetch(process.env.PUBLIC_URL + '/result-16.csv');
  // console.log(process.env.PUBLIC_URL);
  const csvText = await response.text();
  const parsedObj = papa.parse<RawDataType>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  const res = parsedObj.data.map((item) => {
    return NeededFields.reduce<DataType>((prev, key) => {
      return { ...prev, [key]: item[key] };
    }, {} as DataType);
  });

  console.log({ fetched: res });

  return res;
};

const withMemo = <T>(fn: () => Promise<T>) => {
  let memo: Promise<T> | null = null;
  return () => {
    if (memo === null) {
      const promise = fn(); // not need await. memo the Promise not result
      memo = promise;
    }
    return memo;
  };
};

export const fetchDataWithMemo = withMemo(fetchData);

export const fetchFilterOptions = async (payload: {
  target: string;
  filters: Record<string, string[]>;
}) => {
  const data = await fetchDataWithMemo();
  const { filters, target } = payload;

  const filteredData = filteringData(data, filters);

  const options = filteredData.map((data) => data[target as NeededFieldsKeys]);

  return [...new Set(options)];
};
