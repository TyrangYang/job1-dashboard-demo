import React, { FC } from 'react';
// import Filter from './Filter';
import CustomFilter from './Filters/CustomFilter';
import { useMetaData } from '../context/MetaDataProvider';

interface Props {}
const FilterList: FC<Props> = () => {
  const { dimensions } = useMetaData();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        // width: '100vw',
        // flexWrap: 'nowrap',
      }}
    >
      {dimensions.map((filterName) => {
        return (
          <div
            key={`filter-${filterName}`}
            style={{
              width: '400px',
            }}
          >
            <CustomFilter filterKey={filterName} />
          </div>
        );
      })}
    </div>
  );
};
export default FilterList;
