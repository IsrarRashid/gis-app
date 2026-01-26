import DashboardEvaluation from "./components/Evaluation/DashboardEvaluation";
import DashboardMonitoring from "./components/DashboardMonitoring";
import { DashboardType, DashboardTypeEnum } from "./types/types";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const DashboardPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const types = Object.values(DashboardTypeEnum) as DashboardTypeEnum[]; // Cast to TypeEnum[]
  const currentType = types.includes(dashboardType as DashboardTypeEnum)
    ? (dashboardType as DashboardTypeEnum)
    : undefined;

  console.log("types array:", types);
  console.log("searchParams status", dashboardType);
  console.log("currentStatus", currentType);

  return currentType ? <DashboardEvaluation /> : <DashboardMonitoring />;
};

export default DashboardPage;
