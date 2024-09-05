import { useState } from "react";
import SectorsTable from "./SectorsTable";
import TopMenu from "./TopMenu";

const Sectors = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <TopMenu refresh={refresh} setRefresh={setRefresh} />
      <div className="row p-3">
        <SectorsTable refresh={refresh} setRefresh={setRefresh} />
      </div>
    </>
  );
};

export default Sectors;
