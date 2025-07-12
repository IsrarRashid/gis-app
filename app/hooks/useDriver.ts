import { DRIVER_API } from "../APIs";
import useData from "./useData";
import Cookies from "js-cookie";

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

const useDriver = ({ refresh = false }: Props = {}) => {
  const departmentId = Cookies.get("departmentId");

  return useData<Driver>({
    refresh,
    endpoint: DRIVER_API + `?deptId=${departmentId}`,
  });
};

export default useDriver;
