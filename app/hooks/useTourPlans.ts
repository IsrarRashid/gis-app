import { tourPlanAPI } from "../APIs";
import useData from "./useData";

export interface TourPlan {
  id: number;
  name: string;
  tourStartDate: string;
  tourEndDate: string;
  approvalDate: string;
  createdDate: string;
  updatedDate: string;
  createdBy: number;
  updatedBy: number;
}

interface Props {
  refresh?: boolean;
}

const useTourPlans = ({ refresh = false }: Props = {}) =>
  useData<TourPlan>({ refresh, endpoint: tourPlanAPI });

export default useTourPlans;
