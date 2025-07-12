import { DashboardType, TypeEnum } from "../dashboard/types/types";
import SuperGroup from "./components/SuperGroup";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const SuperGroupPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const types = Object.values(TypeEnum) as TypeEnum[]; // Cast to TypeEnum[]
  const currentType = types.includes(dashboardType as TypeEnum)
    ? (dashboardType as TypeEnum)
    : undefined;

  return (
    <>
      <SuperGroup dashboardType={currentType} />
    </>
  );
};

export default SuperGroupPage;
