import React, { useState } from 'react';
import Select, { ActionMeta } from 'react-select';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  name: string;
  value: Option | null;
  onChange: (newValue: Option | null, actionMeta: ActionMeta<Option>) => void;
  options: Option[];
}

const CustomSelect: React.FC<SelectProps> = ({ name, value, onChange, options }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const handleOptionChange = (option: Option | null) => {
    setInputValue('');
    onChange(option, {} as ActionMeta<Option>);
  };

  const customFilterOption = (option: Option, searchText: string) => {
    return option.label.toLowerCase().includes(searchText.toLowerCase());
  };

  return (
    <Select
        name={name}
        value={value}
        onChange={handleOptionChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        options={options}
        filterOption={customFilterOption}
        placeholder='Select a tag'
        isSearchable
        className='w-full'
    />
  );
};

export default CustomSelect;
