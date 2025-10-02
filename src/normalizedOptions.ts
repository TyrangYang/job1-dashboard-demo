import { DataType, OptionsFields } from './fetchData';

type OptionsFieldsType = (typeof OptionsFields)[number];
export const normalizedOption = (data: DataType[]) => {
  const fieldsWithDup = data.reduce(
    (res, curData) => {
      OptionsFields.forEach((cur_f) => {
        res[cur_f].add(curData[cur_f]);
      });
      return res;
    },
    OptionsFields.reduce((prev, cur_f) => {
      return {
        ...prev,
        [cur_f]: new Set(),
      };
    }, {} as { [key in OptionsFieldsType]: Set<string> })
  );

  const fields = Object.fromEntries(
    Object.entries(fieldsWithDup).map(([k, v]) => [k, [...v]]) // remove duplication
  );

  const dimensions = Object.keys(fields);

  return { fields, dimensions };
};
