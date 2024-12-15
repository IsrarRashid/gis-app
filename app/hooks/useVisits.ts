import { visitAPI } from "../APIs";
import useData from "./useData";

export interface Visit {
  id: number;
  projectId: number;
  assignedTo: number;
  status: string;
  latitude: string;
  longitude: string;
  vehicleID: number;
  driverID: number;
  fromDate: string;
  toDate: string;
  createdAt: string;
  updatedAt: string;
  complete_at: string;
  submitted_at: string;
  issued_at: string;
  reportPath: string;
  tracking_status: boolean;
}

interface Props {
  refresh: boolean;
}

const useVisits = ({ refresh }: Props) =>
  useData<Visit>({ refresh, endpoint: visitAPI });

export default useVisits;
