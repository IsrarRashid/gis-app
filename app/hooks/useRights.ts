import { rightAPI } from "../APIs";
import useData from "./useData";

export interface Right {
  rightId: number;
  rightName: string;
  rightIdentifier: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  refresh: boolean;
}

const useRights = ({ refresh }: Props) =>
  useData<Right>({ refresh, endpoint: rightAPI });

export default useRights;
