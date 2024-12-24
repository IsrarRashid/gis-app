import { getAllOfficersAPI } from "../APIs";
import useData from "./useData";

export interface Officer {
  id: number;
  userName: string;
  fullName: string;
  designation: string;
  picture: string;
  email: string;
  phoneNumber: string;
  roleId: string;
}

interface Props {
  refresh: boolean;
}

const useOfficers = ({ refresh }: Props) =>
  useData<Officer>({ refresh, endpoint: getAllOfficersAPI });

export default useOfficers;
