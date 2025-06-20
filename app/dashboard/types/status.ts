export enum StatusEnum {
  MONITORING = "MONITORING",
  EVALUATION = "EVALUATION",
}

export type Status = (typeof StatusEnum)[keyof typeof StatusEnum];
