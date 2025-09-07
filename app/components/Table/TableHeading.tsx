import Image from "next/image";
import CaretUpDown from "@/public/icons/CaretUpDown.svg";
import { CSSProperties } from "react";

interface Props {
  name: string;
  handleSort?: () => void;
  className?: string;
  style?: CSSProperties;
}

const TableHeading = ({ name, handleSort, className, style }: Props) => {
  const defaultStyle: CSSProperties = {
    backgroundColor: "#F8FAFC",
    borderBottom: "1.08px solid #CBD5E1",
    padding: "15.17px 26px",
  };
  return (
    <th
      scope="col"
      className={`cursor-pointer fs15px color-dark-blue ${className || ""}`}
      style={{ ...defaultStyle, ...style }}
      onClick={handleSort}
    >
      <div className="row d-flex align-items-center flex-nowrap">
        <div
          className="col-auto fs15px"
          style={{ paddingRight: "13px", color: "#1E293B" }}
        >
          {name.toUpperCase()}
        </div>
        <div className="col-auto ps-0">
          <Image
            src={CaretUpDown}
            alt="CaretUpDown"
            width={21.6}
            height={21.6}
          />
        </div>
      </div>
    </th>
  );
};

export default TableHeading;
