import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

const TableData = ({ children, className, colSpan }: Props) => {
  return (
    <td
      className={`fs15px fw-5 align-middle ${className || ""}`}
      style={{
        padding: "7px 15px 7px 20px",
        color: "#475569",
      }}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};
export default TableData;
