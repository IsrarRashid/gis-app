import { districtAPI } from "../APIs";
import useData from "./useData";

export interface District {
  id: number;
  divisionName: string;
  districtName: string;
  latitude: string;
  longitude: string;
}

interface Props {
  refresh: boolean;
}

const useDistrict = ({ refresh }: Props) =>
  useData<District>({ refresh, endpoint: districtAPI });

export default useDistrict;
