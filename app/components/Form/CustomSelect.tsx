"use client";
import { useEffect, useState } from "react";
import Select, {
  Props as ReactSelectProps,
  StylesConfig,
  GroupBase,
} from "react-select";

// Define the option type
export interface OptionType {
  value: string | number;
  label: string;
  isDisabled?: boolean;
}

// Props interface that extends React Select props
interface CustomSelectProps
  extends Omit<
    ReactSelectProps<OptionType, boolean, GroupBase<OptionType>>,
    "styles"
  > {
  // You can override styles if needed, otherwise it uses the default
  styles?: StylesConfig<OptionType, boolean, GroupBase<OptionType>>;
  // Add any additional custom props here if needed
  customClassName?: string;
}

const CustomSelect = ({
  styles = customSelectStyles,
  isClearable = true,
  isSearchable = true,
  menuPlacement = "auto",
  menuPosition = "absolute",
  customClassName,
  ...rest
}: CustomSelectProps) => {
  const [menuPortalTarget, setMenuPortalTarget] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    // This code only runs on the client side after the component mounts
    setMenuPortalTarget(document.body);
  }, []);

  return (
    <Select<OptionType, boolean, GroupBase<OptionType>>
      menuPortalTarget={menuPortalTarget}
      menuPlacement={menuPlacement}
      menuPosition={menuPosition}
      styles={styles}
      isClearable={isClearable}
      isSearchable={isSearchable}
      className={customClassName}
      {...rest}
    />
  );
};

export default CustomSelect;

// Custom Select Styles
const customSelectStyles: StylesConfig<
  OptionType,
  boolean,
  GroupBase<OptionType>
> = {
  control: (base, state) => ({
    ...base,
    fontSize: "14px",
    borderRadius: 7,
    background: "rgba(255, 255, 255, 0.8)",
    border: state.isFocused
      ? "1px solid #0c8ce9" // border on focus
      : "1px solid #eff0f2", // default border
    boxShadow: state.isFocused
      ? "0 0 0 1px rgba(12, 140, 233, 0.4)" // focus glow
      : "none",
    "&:hover": {
      border: "1px solid #0c8ce9", // hover border color
      boxShadow: "0 0 0 1px rgba(12, 140, 233, 0.4)", // hover glow
    },
    minHeight: "38px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: 10.5,
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: 4,
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 6px",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    padding: "4px 8px",
    borderRadius: 14,
    border: 0,
    boxShadow: "0px 0px 7px 3px rgba(0,0,0,0.1)",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#E4EDEC" : "white",
    color: "#333",
    fontSize: "14px",
    padding: "10px",
    borderRadius: 7,
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#E4EDEC",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#999",
    fontSize: "14px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#333",
    fontSize: "14px",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#E4EDEC",
    borderRadius: 4,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#333",
    fontSize: "12px",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#666",
    "&:hover": {
      backgroundColor: "#d1d5db",
      color: "#333",
    },
  }),
};

// Usage Examples:

// 1. Single Select Usage:
/*
import CustomSelect, { OptionType } from './CustomSelect';

const singleSelectOptions: OptionType[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const [selectedValue, setSelectedValue] = useState<OptionType | null>(null);

<CustomSelect
  options={singleSelectOptions}
  value={selectedValue}
  onChange={(newValue) => setSelectedValue(newValue)}
  placeholder="Select an option..."
  name="singleSelect"
  id="singleSelect"
/>
*/

// 2. Multi Select Usage:
/*
const multiSelectOptions: OptionType[] = [
  { value: 'tag1', label: 'Tag 1' },
  { value: 'tag2', label: 'Tag 2' },
  { value: 'tag3', label: 'Tag 3' },
  { value: 'tag4', label: 'Tag 4' },
];

const [selectedValues, setSelectedValues] = useState<OptionType[]>([]);

<CustomSelect
  options={multiSelectOptions}
  value={selectedValues}
  onChange={(newValue) => setSelectedValues(newValue as OptionType[])}
  placeholder="Select multiple options..."
  isMulti
  name="multiSelect"
  id="multiSelect"
  closeMenuOnSelect={false}
/>
*/

// 3. With Custom Styles:
/*
const customStyles: StylesConfig<OptionType, boolean, GroupBase<OptionType>> = {
  ...customSelectStyles,
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#10b981' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 1px rgba(16, 185, 129, 0.4)' : 'none',
  }),
};

<CustomSelect
  options={options}
  value={value}
  onChange={onChange}
  styles={customStyles}
/>
*/

// 4. With additional props:
/*
<CustomSelect
  options={options}
  value={value}
  onChange={onChange}
  placeholder="Choose district..."
  isDisabled={isLoading}
  isLoading={isLoading}
  loadingMessage={() => "Loading districts..."}
  noOptionsMessage={({ inputValue }) => `No districts found for "${inputValue}"`}
  maxMenuHeight={200}
  customClassName="my-custom-select"
/>
*/
