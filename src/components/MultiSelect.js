import React from 'react'
import { MultiSelect, useMultiSelect } from "chakra-multiselect";

const items = [
    "Neptunium",
    "Plutonium",
    "Americium",
    "Curium",
    "Berkelium",
    "Californium",
    "Einsteinium",
    "Fermium"
  ];
  
  const _options = items.map((label) => ({ label, value: label.toLowerCase() }));
  
  const ComponentMultiselect = () => {
    const { value, options, onChange } = useMultiSelect({
      value: ["fsdfdsfsdf"],
      options: _options
    });
  
    return (
      <MultiSelect
        options={options}
        value={value}
        label="Choose or create items"
        onChange={onChange}
        create
      />
    );
  };

  export default ComponentMultiselect;