import { getAllUsersAPI } from "../APIs";
import useData from "./useData";

export interface Authentication {
  id: number;
  userName: string;
  email: string;
}

interface Props {
  refresh: boolean;
}

const useAuthentication = ({ refresh }: Props) =>
  useData<Authentication>({ refresh, endpoint: getAllUsersAPI });

export default useAuthentication;
