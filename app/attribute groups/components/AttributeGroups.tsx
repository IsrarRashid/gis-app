import { useState } from "react";
import List from "./List";
import TopMenu from "./TopMenu";

const AttributeGroups = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <TopMenu refresh={refresh} setRefresh={setRefresh} />
      <div className="row p-3">
        <List refresh={refresh} setRefresh={setRefresh} />
      </div>
    </>
  );
};

export default AttributeGroups;
