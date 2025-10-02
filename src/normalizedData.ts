import { DataType } from './fetchData';
export type NormalizedDataType = {
  placed: number;
  cancelled: number;
  inducted: number;
  pending: number;
} & Record<string, string | number>;

const SEPARATOR = '|||||';

export const normalizedData = (
  data: DataType[],
  selectedFilterOptions: Record<string, string[]>
) => {
  const validFilterField = Object.entries(selectedFilterOptions).reduce<
    string[]
  >((res, cur) => {
    const [k, v] = cur;
    if (v.length !== 0) res.push(k);
    return res;
  }, []);

  const filterData = data.filter((eachData) => {
    return validFilterField.every((field) =>
      selectedFilterOptions[field].includes(eachData[field as keyof DataType])
    );
  });

  const genKeyField = (oneData: DataType) => {
    return validFilterField.reduce((res, f) => {
      if (res === '') return oneData[f as keyof DataType];
      return res + SEPARATOR + oneData[f as keyof DataType];
    }, '');
  };

  const groupedData = Object.groupBy(filterData, (each: DataType) =>
    genKeyField(each)
  );
  console.log({ groupedData });

  // aggregate/calculate placed cancelled inducted pending number
  const accumulateData = Object.entries(groupedData).map<NormalizedDataType>(
    ([key, valList]) => {
      const colVal = key.split(SEPARATOR);
      const dimCol = validFilterField.reduce((prev, cur, idx) => {
        return {
          ...prev,
          [cur]: colVal[idx],
        };
      }, {});
      if (valList === undefined || !Array.isArray(valList)) {
        return {
          ...dimCol,
          placed: 0,
          cancelled: 0,
          inducted: 0,
          pending: 0,
        };
      }
      const calValList = valList.reduce(
        (prev, item) => {
          if (item.AOS_ORDERS_CANCELLED !== '') prev.cancelled += 1;

          if (item.SAP_ORDERS_INDUCTED !== '') prev.inducted += 1;

          return prev;
        },
        {
          cancelled: 0,
          inducted: 0,
        }
      );
      return {
        ...dimCol,
        placed: valList.length,
        ...calValList,
        pending: valList.length - calValList.cancelled - calValList.inducted,
      };
    }
  );

  console.log({ normalized: accumulateData });
  return accumulateData;
};
