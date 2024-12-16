import { visitNewAPI } from "../APIs";
import useData from "./useData";

export interface VisitNew {
  id: number;
  gsNo: string;
  name: string;
  userName: string;
  userId: string;
  designation: string;
  sectorId: number;
  sectorName: string;
  districtName: string;
  districtId: number;
  status: string;
}

interface Props {
  refresh: boolean;
}

const useVisitsNew = ({ refresh }: Props) =>
  useData<VisitNew>({ refresh, endpoint: visitNewAPI });

export default useVisitsNew;
