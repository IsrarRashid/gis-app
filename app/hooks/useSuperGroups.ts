import { superGroupApi } from "../APIs";
import useData from "./useData";

export interface GroupsList {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  parentId: number;
  sortId: number;
}

export interface SuperGroup {
  id: number;
  superGroupLabel: string;
  groupsList: GroupsList[];
}

interface Props {
  refresh: boolean;
}

const useSuperGroups = ({ refresh }: Props) =>
  useData<SuperGroup>({ refresh, endpoint: superGroupApi });

export default useSuperGroups;
