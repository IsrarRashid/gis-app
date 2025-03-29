import dynamic from "next/dynamic";

const SummaryDashboard = dynamic(
  () => import("./components/SummaryDashboard"),
  {
    ssr: false,
  }
);
const SummaryDashboardPage = () => {
  return (
    <div className="p-3">
      <SummaryDashboard />
    </div>
  );
};

export default SummaryDashboardPage;
