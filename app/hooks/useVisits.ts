import { visitAPI } from "../APIs";
import useData from "./useData";

export interface AttributeGroup {
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

const useAttributeGroups = ({ refresh }: Props) =>
  useData<AttributeGroup>({ refresh, endpoint: visitAPI });

export default useAttributeGroups;
