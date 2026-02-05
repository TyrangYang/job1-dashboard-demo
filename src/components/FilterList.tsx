import React, { FC } from 'react';
// import Filter from './Filter';
import { useDataContext } from '../context/DataProvider';
import CustomFilter from './Filters/CustomFilter';

interface Props {}
const FilterList: FC<Props> = () => {
  const { filterOptions } = useDataContext();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        // width: '100vw',
        // flexWrap: 'nowrap',
      }}
    >
      {Object.entries(filterOptions).map(([filterName, values]) => {
        const options = values.map((item) => ({ label: item, value: item }));
        return (
          <div
            key={`filter-${filterName}`}
            style={{
              width: '400px',
            }}
          >
            {/* <Filter filterKey={filterName} options={options} /> */}
            <CustomFilter filterKey={filterName} options={options} />
          </div>
        );
      })}
    </div>
  );
};
export default FilterList;
