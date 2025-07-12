export enum TypeEnum {
  EVALUATION = "EVALUATION",
}

export type DashboardType = (typeof TypeEnum)[keyof typeof TypeEnum];
