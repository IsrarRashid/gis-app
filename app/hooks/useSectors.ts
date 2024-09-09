import { sectorAPI } from "../APIs";
import useData from "./useData";

export interface Sector {
  id: number;
  parentId: number;
  name: string;
  description: string;
  createdAt: string;
  updateAt: string;
  sortId: number;
}

interface Props {
  refresh: boolean;
}

const useSectors = ({ refresh }: Props) =>
  useData<Sector>({ refresh, endpoint: sectorAPI });

export default useSectors;
