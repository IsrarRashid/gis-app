import { projectAPI } from "../APIs";
import useData from "./useData";

export interface Project {
  id: number;
  sectorId: number;
  name: string;
  address: string;
  city: string;
  locationCoordinates: string;
  status: string;
  smdpProjectID: number;
}

interface Props {
  refresh: boolean;
}

const useProjects = ({ refresh }: Props) =>
  useData<Project>({ refresh, endpoint: projectAPI });
export default useProjects;
