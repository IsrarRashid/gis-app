import ListWrapper from "../components/ListWrapper";
import { DashboardType, TypeEnum } from "../dashboard/types/types";
import EvaluationVisitPlanList from "./components/VisitPlanEvaluation/EvaluationVisitPlanList";
import MonitoringVisitPlanList from "./components/VisitPlanMonitoring/MonitoringVisitPlanList";

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
      {currentType ? (
        <EvaluationVisitPlanList dashboardType={currentType} />
      ) : (
        <MonitoringVisitPlanList dashboardType={currentType} />
      )}
    </ListWrapper>
  );
};

export default NewVisitPlanPage;
