import { driverApi } from "../APIs";
import useData from "./useData";

export interface Driver {
  id: number;
  driverName: string;
  mobileNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  refresh: boolean;
}

const useDriver = ({ refresh }: Props) =>
  useData<Driver>({ refresh, endpoint: driverApi });

export default useDriver;
