import { Plus_Jakarta_Sans } from "next/font/google";
import ProjectDetailsDashboard from "./components/ProjectDetailsDashboard";
import ProjectDetailsDashboardOldPreview from "./components/ProjectDetailsDashboardOldPreview";

interface Props {
  params: { id: string; visitId: number }; // Change to string to match the routing expectations
}
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SingleProjectDashboard = ({ params }: Props) => {
  const { id, visitId } = params; // Use the id as a string here, if necessary convert it later
  return (
    <div
      className={`col ${plusJakartaSans.className}`}
      // style={{
      //   padding: "139px 200px 0px 138px",
      // }}
    >
      <ProjectDetailsDashboardOldPreview id={id} visitId={visitId} />
    </div>
  );
};

export default SingleProjectDashboard;

// uncomment below code for export build
// export async function generateStaticParams() {
//   let ids: String[] = [];
//   for (let i = 0; i <= 7300; i++) {
//     ids.push(String(i));
//   }
//   return ids.map((id) => ({ id })); // Keep id as a string
// }

// Replace with actual data fetching
// const ids = [
//   "1",
//   "2",
//   "3",
//   "4",
//   "5",
//   "6",
//   "7",
//   "8",
//   "9",
//   "10",
//   "11",
//   "12",
//   "13",
// ]; // List of IDs to statically generate pages for
