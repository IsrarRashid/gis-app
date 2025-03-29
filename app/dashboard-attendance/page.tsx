import dynamic from "next/dynamic";

const AttendanceHome = dynamic(
  () => import("./components/AttendanceHome/AttendanceHome"),
  {
    ssr: false,
  }
);

const DashboardAttendancePage = () => {
  return (
    <div className="p-3">
      <AttendanceHome />
    </div>
  );
};

export default DashboardAttendancePage;
