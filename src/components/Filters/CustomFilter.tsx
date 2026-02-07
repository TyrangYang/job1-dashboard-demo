import React, { FC } from 'react';
import FilterProvider, { useFilterContext } from './FilterProvider';

import styles from './filter.module.css';
import Select from 'antd/es/select';

const maxOnScreen = 5;

interface Props {
  filterKey: string;
}

const CustomFilter: FC<Props> = ({ filterKey }) => {
  // console.log(filterKey, options);

  return (
    <FilterProvider filterKey={filterKey}>
      <label className={styles.filterLabel}>{filterKey}</label>
      <FilterBoard />
    </FilterProvider>
  );
};

const FilterBoard: FC = () => {
  const { loading, options, filterKey } = useFilterContext();
  const optionsAsBtn = options.slice(0, maxOnScreen);
  const optionsInDropDown = options.slice(maxOnScreen);
  if (loading) {
    return <div>loading</div>;
  }
  return (
    <div className={styles.filterBoard}>
      <ALLButton />
      {optionsAsBtn.map((eachOption) => {
        return (
          <FilterItemButton
            key={`filter-${filterKey}-item-button-${eachOption.value}`}
            label={eachOption.label}
            value={eachOption.value}
            selected={eachOption.isSelected}
          />
        );
      })}
      {optionsInDropDown.length !== 0 && (
        <SelectMore options={optionsInDropDown} />
      )}
    </div>
  );
};

interface ItemsProps {
  label: string;
  value: string;
  selected: boolean;
}

export const FilterItemButton: FC<ItemsProps> = ({
  label,
  value,
  selected,
}) => {
  const { dispatchOptionSelectedStatus } = useFilterContext();

  const handleOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // console.log(e.metaKey);
    // console.log(value);
    dispatchOptionSelectedStatus({ type: 'toggle', optionKey: value });
  };
  return (
    <button
      className={`${styles.filterButton} ${selected ? styles.active : ''}`}
      onClick={handleOnClick}
    >
      {label}
    </button>
  );
};

const ALLButton: FC = () => {
  const { isAllSelected, dispatchOptionSelectedStatus } = useFilterContext();
  const handleOnClick = () => {
    if (isAllSelected) dispatchOptionSelectedStatus({ type: 'cleanAll' });
    else dispatchOptionSelectedStatus({ type: 'selectAll' });
  };
  return (
    <button
      className={`${styles.filterButton} ${isAllSelected ? styles.active : ''}`}
      onClick={handleOnClick}
    >
      ALL
    </button>
  );
};

interface SelectMoreProps {
  options: {
    label: string;
    value: string;
    isSelected: boolean;
  }[];
}
export const SelectMore: FC<SelectMoreProps> = ({ options }) => {
  const { dispatchOptionSelectedStatus } = useFilterContext();
  const toggle = (value: string) => {
    dispatchOptionSelectedStatus({ type: 'toggle', optionKey: value });
  };
  return (
    <Select
      mode="multiple"
      allowClear
      size="small"
      styles={{
        item: {
          background: 'aqua',
        },
        placeholder: {
          color: 'black',
        },
      }}
      style={{ width: '100%' }}
      placeholder={'more +' + options.length}
      value={options.filter((e) => e.isSelected).map((e) => e.value)}
      onSelect={toggle}
      onDeselect={toggle}
      options={options}
    />
  );
};

export default CustomFilter;
