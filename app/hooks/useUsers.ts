import { userAPI } from "../APIs";
import useData from "./useData";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  roleId: number;
  password: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  refresh: boolean;
}

const useUsers = ({ refresh }: Props) =>
  useData<User>({ refresh, endpoint: userAPI });

export default useUsers;
