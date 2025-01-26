import { driverApi } from "../APIs";
import useData from "./useData";

export interface Driver {
  id: number;
  user_Id: number;
  driverName: string;
  driverImage: string;
  mobileNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  refresh?: boolean;
}

const useDriver = ({ refresh = false }: Props = {}) =>
  useData<Driver>({ refresh, endpoint: driverApi });

export default useDriver;
