import React, { FC } from 'react';
// import Filter from './Filter';
import CustomFilter from './Filters/CustomFilter';
import { useMetaData } from '../context/MetaDataProvider';
import ControllerProvider from './Filters/CascadeControllerProvider';

interface Props {}
const FilterList: FC<Props> = () => {
  const { dimensions, dependencies } = useMetaData();
  return (
    <ControllerProvider allDependencies={dependencies}>
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
              <CustomFilter filterLabel={dim.label} filterKey={filterName} />
            </div>
          );
        })}
      </div>
    </ControllerProvider>
  );
};
export default FilterList;
