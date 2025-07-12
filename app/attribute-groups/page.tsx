import { DashboardType, TypeEnum } from "../dashboard/types/types";
import AttributeGroups from "./components/AttributeGroups";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const AttributeGroupsPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const types = Object.values(TypeEnum) as TypeEnum[]; // Cast to TypeEnum[]
  const currentType = types.includes(dashboardType as TypeEnum)
    ? (dashboardType as TypeEnum)
    : undefined;

  return (
    <>
      <AttributeGroups dashboardType={currentType} />
    </>
  );
};

export default AttributeGroupsPage;
