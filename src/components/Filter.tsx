import React, { FC, useState } from 'react';
import type { SelectProps } from 'antd';
import { Select } from 'antd';
import { useDataContext } from '../context/DataProvider';

interface Props {
  filterKey: string;
  options: SelectProps['options'];
}

const Filter: FC<Props> = ({ filterKey, options }) => {
  const { setSelectedFilterOptions } = useDataContext();
  const [selectedValue, setSelectedValue] = useState<string[]>([]);

  const handleChange = (value: string[]) => {
    const prevIncludeALL = selectedValue.includes('ALL');
    const curIncludeALL = value.includes('ALL');
    if (!prevIncludeALL && curIncludeALL) {
      setSelectedValue(['ALL']);
      setSelectedFilterOptions({
        field: filterKey,
        value: (options ?? []).map((e) => e.value as string),
      });
    } else if (prevIncludeALL) {
      setSelectedValue(value.filter((e) => e !== 'ALL'));
      setSelectedFilterOptions({
        field: filterKey,
        value: value.filter((e) => e !== 'ALL'),
      });
    } else {
      setSelectedValue(value);
      setSelectedFilterOptions({
        field: filterKey,
        value,
      });
    }
  };

  return (
    <div>
      <Select
        allowClear
        mode="multiple"
        placeholder="Please select"
        onChange={handleChange}
        value={selectedValue}
        style={{ width: '100%' }}
        options={[{ label: 'ALL', value: 'ALL' }, ...(options ?? [])]}
      />
    </div>
  );
};
export default Filter;
