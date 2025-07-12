import Dashboard from "./components/Dashboard";
import { DashboardType, TypeEnum } from "./types/types";
export const dynamic = "force-dynamic";

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

  return <Dashboard dashboardType={currentType} />;
};

export default DashboardPage;
