import { vehicleApi } from "../APIs";
import useData from "./useData";

export interface Vehicle {
  id: number;
  name: string;
  description: string;
  vehicleNumber: string;
  model: string;
  color: string;
  trasnmission: string;
  seatsCapacity: number;
  fuelType: string;
  vehicleImage: string;
  vehicleIcon: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  refresh?: boolean;
}

const useVehicle = ({ refresh = false }: Props = {}) =>
  useData<Vehicle>({ refresh, endpoint: vehicleApi });

export default useVehicle;
