export type MetaDataType = {
  dimensions: DimensionType[];
};

export type DimensionType = {
  order: number;
  label: string;
  key: string;
  parent?: string[];
};
