import ListWrapper from "../components/ListWrapper";
import { DashboardType, TypeEnum } from "../dashboard/types/types";
import List from "./components/List";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const NewVisitPlanPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const types = Object.values(TypeEnum) as TypeEnum[]; // Cast to TypeEnum[]
  const currentType = types.includes(dashboardType as TypeEnum)
    ? (dashboardType as TypeEnum)
    : undefined;

  return (
    <ListWrapper>
      <List dashboardType={currentType} />
    </ListWrapper>
  );
};

export default NewVisitPlanPage;
