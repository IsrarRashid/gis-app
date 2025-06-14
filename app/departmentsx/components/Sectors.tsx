"use client";
import { useState } from "react";
import SectorsTable from "./SectorsTable";

const Sectors = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <div
        className="container p-3 mt-3 mb-4"
        style={{
          background: "rgba(209, 209, 209, 0.4)",
          border: "1px solid #dbdbdb",
          padding: "10px",
          borderRadius: "15px",
        }}
      >
        <div className="row p-3">
          <SectorsTable refresh={refresh} setRefresh={setRefresh} />
        </div>
      </div>
    </>
  );
};

export default Sectors;
