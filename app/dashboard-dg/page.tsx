import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("./components/Dashboard"), {
  ssr: false,
});

const DashboardPage = () => {
  return (
    <div className="p-3">
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
