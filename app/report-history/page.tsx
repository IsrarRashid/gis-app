import { DashboardType, DashboardTypeEnum } from "../dashboard/types/types";
import List from "./list/components/List";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const ReportHistoryPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const types = Object.values(DashboardTypeEnum) as DashboardTypeEnum[]; // Cast to TypeEnum[]
  const currentType = types.includes(dashboardType as DashboardTypeEnum)
    ? (dashboardType as DashboardTypeEnum)
    : undefined;
  return (
    <div className="p-3 pt-0">
      <List dashbaordType={currentType} />
    </div>
  );
};

export default ReportHistoryPage;
