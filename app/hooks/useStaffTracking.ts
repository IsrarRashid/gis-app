import { coordinatesAPI } from "../APIs";
import useData from "./useData";

export interface StaffTracking {
  id: number;
  visitID: number;
  userID: number;
  latitude: string;
  longitude: string;
  createdAt: string;
}

interface Props {
  refresh: boolean;
}

const useStaffTrackings = ({ refresh }: Props) =>
  useData<StaffTracking>({ refresh, endpoint: coordinatesAPI });

export default useStaffTrackings;
