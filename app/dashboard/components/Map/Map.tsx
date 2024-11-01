import dynamic from "next/dynamic";
import { MainDashboard, ProjectsList } from "../Dashboard";
import { Dispatch, SetStateAction } from "react";

interface Props {
  data: MainDashboard;
  setData: Dispatch<SetStateAction<MainDashboard | undefined>>;
  setProjectsData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
}

const Map = dynamic<Props>(() => import("./MapComponent"), {
  ssr: false, // This ensures the component is not server-side rendered
});

export default Map;
