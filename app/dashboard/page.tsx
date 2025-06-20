import Dashboard from "./components/Dashboard";
import { Status, StatusEnum } from "./types/status";

interface Props {
  searchParams: Promise<{
    status: Status;
  }>;
}

const DashboardPage = async ({ searchParams }: Props) => {
  const { status } = await searchParams;

  const statuses = Object.values(StatusEnum) as StatusEnum[]; // Cast to StatusEnum[]
  const currentStatus = statuses.includes(status as StatusEnum)
    ? (status as StatusEnum)
    : StatusEnum.MONITORING;

  console.log("statuses array:", statuses);
  console.log("searchParams status", status);
  console.log("currentStatus", currentStatus);

  return <Dashboard status={currentStatus} />;
};

export default DashboardPage;
