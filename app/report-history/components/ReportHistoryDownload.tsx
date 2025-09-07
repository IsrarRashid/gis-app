import DownloadDropDown from "@/app/components/UserDropDown/DownloadDropDown";
import { ReportHistoryUser } from "@/app/hooks/useReportHistoryUsers";
import {
  convertToLocaleTimeString,
  exportToPDFNew,
  getFormattedDate,
} from "@/app/utils";
import { ReportHistory } from "./ReportNoting";
import { SubmittedReport } from "../list/components/List";

interface Props {
  data: ReportHistory[];
  users: ReportHistoryUser[];
  submittedReport: SubmittedReport;
}

const ReportHistoryDownload = ({ data, users, submittedReport }: Props) => {
  // ──────────── (2) Create table rows from cards ────────────
  function cardsToTableRows(
    users: ReportHistoryUser[],
    data: ReportHistory[]
  ): Array<Record<string, string>> {
    return data.map((d, i) => ({
      "Sr. No.": (i + 1).toString(),
      From:
        `${users.find((u) => u.id === d.submittedFrom)?.fullName} ${
          i + 1 === 1
            ? `(${users.find((u) => u.id === d.submittedFrom)?.designation})`
            : ""
        }` || "NA",
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
          exportToPDFNew(
            columns,
            cardsToTableRows(users, data),
            new Date(),
            "Report History -" +
              `${
                submittedReport.reportType === 1 ? "MONITORING" : "EVALUATION"
              }` +
              " - (GS. NO- " +
              submittedReport.gsNo +
              ") - " +
              submittedReport.projectName
          )
        }
      />
    </div>
  );
};

export default ReportHistoryDownload;
