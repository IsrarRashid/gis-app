import { ReactNode } from "react";

interface Props {
  thead: ReactNode;
  tbody: ReactNode;
}

const TableWrapper = ({ thead, tbody }: Props) => {
  return (
    <div className="table-responsive mb-2" style={{ margin: "0px -12px" }}>
      <div style={{ height: "calc(100vh - 260px)", overflow: "auto" }}>
        <table className="table table-hover mb-0">
          {thead}
          {tbody}
        </table>
      </div>
    </div>
  );
};

export default TableWrapper;
