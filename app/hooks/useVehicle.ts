import { vehicleApi } from "../APIs";
import useData from "./useData";

export interface Vehicle {
  id: number;
  regNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  refresh: boolean;
}

const useVehicle = ({ refresh }: Props) =>
  useData<Vehicle>({ refresh, endpoint: vehicleApi });

export default useVehicle;
