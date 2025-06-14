import { TEMP_TOUR_PLAN_API } from "../APIs";
import useData from "./useData";

export interface TempTourPlan {
  tempId: number;
  departmentId: number;
  gsNo: string;
  projectid: number;
  projectName: string;
  projectId: number;
  district: string;
  sectors: string;
  cost: number;
  type: number;
  userId: number;
  meOfficerName: string;
  section: string;
  dateFrom: string;
  dateTo: string;
  driverName: string;
  vehicleNumber: string;
  vehicleId: number;
  driverId: number;
  districtId: number;
}

interface Props {
  refresh?: boolean;
}

const useTempTourPlans = ({ refresh = false }: Props = {}) =>
  useData<TempTourPlan>({
    refresh,
    endpoint: TEMP_TOUR_PLAN_API + "/get-tour-plan",
  });

export default useTempTourPlans;
