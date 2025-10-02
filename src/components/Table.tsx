import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { FC, useMemo } from 'react';
import type { NormalizedDataType } from '../normalizedData';
import { useDataContext } from '../context/DataProvider';

interface Props {
  data: NormalizedDataType[];
}

const Table: FC<Props> = ({ data }) => {
  const { allAvailableDimension } = useDataContext();
  console.log({ allAvailableDimension });
  const columnDefs = useMemo<ColDef[]>(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((f) => {
      if (allAvailableDimension.includes(f))
        return { field: f, rowGroup: true, hide: true };
      return { field: f };
    });
  }, [data, allAvailableDimension]);

  return (
    <AgGridReact
      rowData={data}
      columnDefs={columnDefs}
      groupDisplayType={'multipleColumns'}
      groupDefaultExpanded={-1}
      groupHideOpenParents
    />
  );
};
export default Table;
