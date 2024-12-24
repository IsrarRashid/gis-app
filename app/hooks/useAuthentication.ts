import { getAllUsersAPI } from "../APIs";
import useData from "./useData";

export interface Authentication {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  designation: string;
  picture: string;
  phoneNumber: string;
  roleId: string;
}

interface Props {
  refresh: boolean;
}

const useAuthentication = ({ refresh }: Props) =>
  useData<Authentication>({ refresh, endpoint: getAllUsersAPI });

export default useAuthentication;
