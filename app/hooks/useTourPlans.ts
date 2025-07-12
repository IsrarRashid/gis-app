import { TOUR_PLAN_API } from "../APIs";
import useData from "./useData";
import Cookies from "js-cookie";

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

const useTourPlans = ({ refresh = false }: Props = {}) => {
  const departmentId = Cookies.get("departmentId");

  return useData<TourPlan>({
    refresh,
    endpoint: TOUR_PLAN_API + `?departmentId=${departmentId}`,
  });
};

export default useTourPlans;
