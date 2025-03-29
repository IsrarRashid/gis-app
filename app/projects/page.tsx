// import DownloadPDFTest from "./components/DownloadPDFTest";
import dynamic from "next/dynamic";

const Projects = dynamic(() => import("./components/Projects"), {
  ssr: false,
});

const ProjectPage = () => {
  return (
    <>
      <Projects />
      {/* <DownloadPDFTest /> */}
    </>
  );
};

export default ProjectPage;
