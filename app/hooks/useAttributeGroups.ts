import { attributeGroupsAPI } from "../APIs";
import useData from "./useData";

export interface AttributeGroup {
  id: number;
  parentId: number;
  parentName: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sortId: number;
  group_type: number;
  group_nature: number;
}

interface Props {
  refresh?: boolean;
}

const useAttributeGroups = ({ refresh = false }: Props = {}) =>
  useData<AttributeGroup>({ refresh, endpoint: attributeGroupsAPI });

export default useAttributeGroups;
