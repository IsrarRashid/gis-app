import dynamic from "next/dynamic";
import UserProjects from "./components/UserProjects";

const Dashboard = dynamic(() => import("./components/Dashboard"), {
  ssr: false,
});

const DashboardPage = () => {
  return (
    <>
      <Dashboard />
      {/* <hr />
      <UserProjects /> */}
    </>
  );
};

export default DashboardPage;
