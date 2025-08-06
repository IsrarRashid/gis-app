import DownloadDropDown from "@/app/components/UserDropDown/DownloadDropDown";
import { ReportHistory } from "./ReportNoting";
import {
  convertToLocaleTimeString,
  exportToPDF,
  getFormattedDate,
} from "@/app/utils";
import { ReportHistoryUser } from "@/app/hooks/useReportHistoryUsers";

interface Props {
  data: ReportHistory[];
  users: ReportHistoryUser[];
  projectName: string;
  initialUser: string;
}

const ReportHistoryDownload = ({
  data,
  users,
  projectName,
  initialUser,
}: Props) => {
  // ──────────── (2) Create table rows from cards ────────────
  function cardsToTableRows(
    users: ReportHistoryUser[],
    data: ReportHistory[]
  ): Array<Record<string, string>> {
    return data.map((d, i) => ({
      "Sr. No.": (i + 1).toString(),
      From: users.find((u) => u.id === d.submittedFrom)?.fullName || "NA",
      To: users.find((u) => u.id === d.submittedTo)?.fullName || "NA",
      Date:
        `${getFormattedDate(new Date(d.sDate), "short")} ` +
        "(" +
        `${convertToLocaleTimeString(new Date(d.sDate).toLocaleTimeString())}` +
        ")",
      //   "Report Link": d.reportPath,
      Comments: d.remarks.replace(/\r\n?/g, "\n").substring(0, 200), // limit length if needed
    }));
  }

  // ──────────── (3) Export with your current function ────────────
  const columns = [
    { header: "Sr. No.", dataKey: "Sr. No." },
    { header: "From", dataKey: "From" },
    { header: "To", dataKey: "To" },
    { header: "Date", dataKey: "Date" },
    // { header: "Report Link", dataKey: "Report Link" },
    { header: "Comments", dataKey: "Comments" },
  ];
  return (
    <div>
      <DownloadDropDown
        onClickPdf={() =>
          exportToPDF(
            columns,
            cardsToTableRows(users, data),
            new Date(),
            "Report History - " +
              initialUser +
              " " +
              projectName.substring(0, 18) +
              "..."
          )
        }
      />
    </div>
  );
};

export default ReportHistoryDownload;
