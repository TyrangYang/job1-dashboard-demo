import React, { FC, useEffect, useMemo } from 'react';
// import Filter from './Filter';
import CustomFilter from './Filters/CustomFilter';
import { useMetaData } from '../context/MetaDataProvider';
import { createCascadeController } from './Filters/cascadeController';

interface Props {}
const FilterList: FC<Props> = () => {
  const { dimensions, dependencies } = useMetaData();

  const controller = useMemo(() => {
    return createCascadeController(dependencies);
  }, [dependencies]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        // width: '100vw',
        // flexWrap: 'nowrap',
      }}
    >
      {dimensions.map((dim) => {
        const filterName = dim.key;
        return (
          <div
            key={`filter-${filterName}`}
            style={{
              width: '400px',
            }}
          >
            <CustomFilter
              filterLabel={dim.label}
              filterKey={filterName}
              controller={controller}
            />
          </div>
        );
      })}
    </div>
  );
};
export default FilterList;
