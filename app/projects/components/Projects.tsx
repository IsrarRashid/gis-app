import { useState } from "react";
import ProjectsList from "./ProjectsList";
import TopMenu from "./TopMenu";

const Projects = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      {/* <TopMenu refresh={refresh} setRefresh={setRefresh} /> */}
      <div className="row p-3">
        <ProjectsList refresh={refresh} setRefresh={setRefresh} />
      </div>
    </>
  );
};

export default Projects;
