import DashboardEvaluation from "./components/Evaluation/DashboardEvaluation";
import DashboardMonitoring from "./components/DashboardMonitoring";
import { DashboardType, TypeEnum } from "./types/types";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const DashboardPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const types = Object.values(TypeEnum) as TypeEnum[]; // Cast to TypeEnum[]
  const currentType = types.includes(dashboardType as TypeEnum)
    ? (dashboardType as TypeEnum)
    : undefined;

  console.log("types array:", types);
  console.log("searchParams status", dashboardType);
  console.log("currentStatus", currentType);

  return currentType ? <DashboardEvaluation /> : <DashboardMonitoring />;
};

export default DashboardPage;
