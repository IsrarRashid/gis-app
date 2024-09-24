import { attributesAPI } from "../APIs";
import useData from "./useData";

export interface Attribute {
  attributeId: number;
  attributeDataType: string;
  multiselect: number;
  label: string;
  validationRegx: string;
  min: number;
  max: number;
  required: number;
  status: number;
  hidden: number;
  createdAt: string;
  updatedAt: string;
  placeholder: string;
  attributeType: string;
  unit: string;
  errorMessage: string;
  verificationType: string;
  sortId: number;
  remarks: string;
  weightage: number;
  attributeCode: string;
  evaluationFormula: string;
  parentId: number;
  options?: [
    {
      value: string;
      attributeId: number;
      sortId: number;
      isActive: number;
      label: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
}

interface Props {
  refresh: boolean;
}

const useAttributes = ({ refresh }: Props) =>
  useData<Attribute>({ refresh, endpoint: attributesAPI });

export default useAttributes;
