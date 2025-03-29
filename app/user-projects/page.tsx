// import DownloadPDFTest from "./components/DownloadPDFTest";
import dynamic from "next/dynamic";

const UserProjects = dynamic(() => import("./components/UserProjects"), {
  ssr: false,
});

const UserProjectsPage = () => {
  return (
    <>
      <UserProjects />
      {/* <DownloadPDFTest /> */}
    </>
  );
};

export default UserProjectsPage;
