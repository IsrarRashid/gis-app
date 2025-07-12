import { DashboardType, TypeEnum } from "../dashboard/types/types";
import Attributes from "./components/Attributes";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const AttributesPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const types = Object.values(TypeEnum) as TypeEnum[]; // Cast to TypeEnum[]
  const currentType = types.includes(dashboardType as TypeEnum)
    ? (dashboardType as TypeEnum)
    : undefined;

  return (
    <>
      <Attributes dashboardType={currentType} />
    </>
  );
};

export default AttributesPage;
