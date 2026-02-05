import React, { FC, useState } from 'react';
import FilterProvider, {
  OptionsBasic,
  useFilterContext,
} from './FilterProvider';

import styles from './filter.module.css';
import Select from 'antd/es/select';

const maxOnScreen = 6;

interface Props {
  filterKey: string;
  options: OptionsBasic[];
}

const CustomFilter: FC<Props> = ({ filterKey, options }) => {
  console.log(filterKey, options);

  const optionsAsBtn = options.slice(0, maxOnScreen);
  const optionsInDropDown = options.slice(maxOnScreen);

  return (
    <FilterProvider filterKey={filterKey} options={options}>
      <label className={styles.filterLabel}>{filterKey}</label>
      <div className={styles.filterBoard}>
        {optionsAsBtn.map((eachOption) => {
          return (
            <FilterItemButton
              label={eachOption.label}
              value={eachOption.value}
            />
          );
        })}
        {optionsInDropDown.length !== 0 && (
          <SelectMore options={optionsInDropDown} />
        )}
      </div>
    </FilterProvider>
  );
};

interface ItemsProps {
  label: string;
  value: string;
}

export const FilterItemButton: FC<ItemsProps> = ({ label, value }) => {
  const [selected, setSelected] = useState(false);
  const { addSelectedValue, removeSelectedValue } = useFilterContext();

  const handleOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // console.log(e.metaKey);
    if (selected) {
      removeSelectedValue(value);
    } else {
      addSelectedValue(value);
    }
    setSelected((prev) => !prev);
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
  const [selected, setSelected] = useState(false);
  const handleOnClick = () => {
    setSelected((prev) => !prev);
  };
  return (
    <button
      className={`${styles.filterButton} ${selected ? styles.active : ''}`}
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
  }[];
}
export const SelectMore: FC<SelectMoreProps> = ({ options }) => {
  const [values, setValues] = useState<string[]>([]);
  const { addSelectedValue, removeSelectedValue } = useFilterContext();
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
      value={values}
      onChange={(values: string[]) => {
        setValues(values);
      }}
      onSelect={addSelectedValue}
      onDeselect={removeSelectedValue}
      options={options}
    />
  );
};

export default CustomFilter;
