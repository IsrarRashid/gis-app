import { attributeGroupsAPI } from "../APIs";
import useData from "./useData";

export interface AttributeGroup {
  id: number;
  parentId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sortId: number;
}

interface Props {
  refresh?: boolean;
}

const useAttributeGroups = ({ refresh = false }: Props = {}) =>
  useData<AttributeGroup>({ refresh, endpoint: attributeGroupsAPI });

export default useAttributeGroups;
