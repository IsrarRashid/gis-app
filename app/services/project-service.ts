import create from "./http-service";

export interface Project {
  id: number;
  name: string;
  sectorId: number;
  address: string;
  city: string;
  locationCoordinates: string;
  status: string;
  sectorName: string;
  groups: string;
}

export default create("/api/Projects");
