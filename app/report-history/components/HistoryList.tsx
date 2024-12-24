"use client";
import useReportHistoryUser from "@/app/hooks/useReportHistoryUsers";
import { getFormattedDate } from "@/app/utils";
import Link from "next/link";
import { useState } from "react";
import { ReportHistory } from "./List";

const HistoryList = ({ data }: { data: ReportHistory[] }) => {
  const [refresh, setRefresh] = useState(false);
  const { data: users } = useReportHistoryUser({ refresh });

  return (
    <div className="col mb-3" style={{ height: "300px", overflow: "scroll" }}>
      {data?.map((d) => (
        <div
          key={d.id}
          className="col p-4 ms-1 mb-3"
          style={{
            background: "#FAFAFA",
            borderRadius: "12px",
          }}
        >
          <div className="row d-flex m-0 mb-3">
            <div className="col">
              <p className="fw-normal m-0">
                From:{" "}
                <span>
                  {users.find((user) => user.id === d.submittedFrom)?.fullName}
                </span>
              </p>
            </div>
            <div className="col">
              <p className="fw-normal m-0">
                To:{" "}
                <span>
                  {users.find((user) => user.id === d.submittedTo)?.fullName}
                </span>
              </p>
            </div>
            <div className="col">
              <p className="fw-normal m-0">
                Date:{" "}
                <span>{getFormattedDate(new Date(d.sDate), "short")}</span>
              </p>
            </div>
            <div className="col text-end">
              <Link
                target="_blank"
                href={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.reportPath}`}
                className="btn rounded-pill fs15px"
                style={{ background: "#E4E4E4" }}
              >
                View PDF
              </Link>
            </div>
          </div>
          <hr style={{ opacity: ".1" }} />
          <p className="mb-1 fw-normal fs18px">Comments</p>
          <div
            className="mb-2 bg-white p-3"
            style={{
              borderRadius: "12px",
              border: "1px solid rgba(38, 50, 56,.1)",
            }}
          >
            {d.remarks}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
