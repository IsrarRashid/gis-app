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
}

interface Props {
  refresh: boolean;
}

const useVisits = ({ refresh }: Props) =>
  useData<Visit>({ refresh, endpoint: visitAPI });

export default useVisits;
