import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const RowHeader = ({ children, className }: Props) => {
  return (
    <th
      className={className + " align-middle"}
      scope="row"
      style={{
        padding: "7px 15px 7px 20px",
        color: "#475569",
      }}
    >
      {children}
    </th>
  );
};

export default RowHeader;
