// import DownloadPDFTest from "./components/DownloadPDFTest";

import { DashboardType, TypeEnum } from "../dashboard/types/types";
import Projects from "./components/Projects";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const ProjectPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const types = Object.values(TypeEnum) as TypeEnum[]; // Cast to TypeEnum[]
  const currentType = types.includes(dashboardType as TypeEnum)
    ? (dashboardType as TypeEnum)
    : undefined;

  return (
    <>
      <Projects dashboardType={currentType} />
      {/* <DownloadPDFTest /> */}
    </>
  );
};

export default ProjectPage;
