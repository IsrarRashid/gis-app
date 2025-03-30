"use client";
import Select, { ActionMeta, SingleValue } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface Props {
  data: any[];
  value: string;
  label: string;
  name: string;
  onChange:
    | ((newValue: SingleValue<Option>, actionMeta: ActionMeta<Option>) => void)
    | undefined;
}

const SearchableSingleSelect = ({
  data,
  value,
  label,
  name,
  onChange,
}: Props) => {
  const defaultOption = { value: "", label: "Select" };
  const options: Option[] = [
    defaultOption,
    ...data.map((d: any) => ({
      value: d[value],
      label: d[label],
    })),
  ];

  return (
    <Select
      className="basic-single"
      classNamePrefix="select"
      defaultValue={options[0]}
      isSearchable={true}
      name={name}
      isClearable={true}
      options={options}
      onChange={onChange}
    />
  );
};

export default SearchableSingleSelect;
