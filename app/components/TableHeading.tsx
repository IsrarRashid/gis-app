import Image from "next/image";
import upDownArrow from "../../public/icons/upDownArrow.svg";

interface Props {
  name: string;
  handleSort: () => void;
}

const TableHeading = ({ name, handleSort }: Props) => {
  return (
    <th style={{ whiteSpace: "nowrap" }} onClick={handleSort}>
      {name.toUpperCase()}&nbsp;
      <Image src={upDownArrow} alt="upDownArrow" />
    </th>
  );
};

export default TableHeading;
