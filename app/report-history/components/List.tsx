"use client";
import { reportsHistoryAPI } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal";
import useProjects from "@/app/hooks/useProjects";
import useReportHistoryUser from "@/app/hooks/useReportHistoryUsers";
import apiClient from "@/app/services/api-client";
import {
  addDayToFormattedDate,
  getFormattedDate,
  SingleProjectLessData,
} from "@/app/utils";
import search3 from "@/public/icons/search3.svg";
import tickBgGreen from "@/public/icons/tickBgGreen.svg";
import Cookies from "js-cookie";
import { Raleway } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReportNoting from "./ReportNoting";

const raleway = Raleway({
  subsets: ["latin"],
});

export interface ReportHistory {
  id: number;
  visitId: number;
  projectId: number;
  submittedFrom: number;
  submittedTo: number;
  remarks: string;
  reportPath: string;
  status: number;
  sDate: string;
  reportType: number;
}

const List = () => {
  const [refresh, setRefresh] = useState(false);
  // useAuthorization("report-history");
  const [data, setData] = useState<ReportHistory[]>();
  const [userId, setUserId] = useState<number>();
  const { data: users } = useReportHistoryUser({ refresh });
  const [singleProjectData, setSingleProjectData] =
    useState<SingleProjectLessData>();

  useEffect(() => {
    // Set the background for the body
    document.body.style.backgroundImage = `url('/images/bg2.png')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";

    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  useEffect(() => {
    const id = Cookies.get("userId");
    // const role = Cookies.get("role");
    if (id) setUserId(parseInt(id));
  }, []);

  useEffect(() => {
    const handleSubmit = async (userId: number) => {
      try {
        const response = await apiClient.get(
          `${reportsHistoryAPI}/GetSubmittedReports?submittedTo=${userId}`
        );
        setData(response.data.data);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    if (userId) handleSubmit(userId);
  }, [userId, refresh]);

  const { data: projects } = useProjects({ refresh });

  return (
    <>
      <div
        className={`container-fluid p-3 mt-3 mb-4 ${raleway.className}`}
        style={{
          background:
            "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6) , rgba(255, 255, 255, 0.08))",
          border: "1px solid rgba(255, 255, 255, 0.29)",
          borderRadius: "15px",
          padding: "10px",
        }}
      >
        <div className="row d-flex m-0">
          <div className="col m-auto">
            <h5 className="fs18px fw-bold">List of Reports</h5>
          </div>
          <div className="col">
            <div className="row d-flex m-0 justify-content-end mb-3">
              <div className="col-auto text-start">
                <select
                  className="form-select w-100 rounded-pill bg-transparent px-3"
                  style={{
                    outline: "none",
                    border: "1px solid rgba(38, 50, 56,.6)",
                  }}
                  aria-label="Officer Name"
                  name="officerName"
                >
                  <option value="">Search By Officer&nbsp;&nbsp;⌵</option>
                  <option value="">officer name</option>
                  <option value="">officer name</option>
                </select>
              </div>
              <div className="col-auto">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="input-group">
                    <button
                      className="btn rounded-end rounded-pill text-white shadow-none border-end-0 pe-0"
                      type="submit"
                      style={{
                        border: "1px solid rgba(38, 50, 56,.6)",
                      }}
                    >
                      <Image
                        src={search3}
                        alt="search3"
                        width={18}
                        height={18}
                      />
                    </button>
                    <input
                      type="text"
                      className="form-control border-start-0 rounded-pill rounded-start shadow-none fs14px bg-transparent py-2"
                      style={{
                        border: "1px solid rgba(38, 50, 56,.6)",
                        color: "rgba(38, 50, 56,1)",
                      }}
                      placeholder="Search"
                      // value={searchTerm}
                      // onChange={handleChange}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {data &&
          data.map((d) => (
            <div key={d.id} className="col mb-2">
              <div
                className="col p-3"
                style={{
                  background: "#FAFAFA",
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 0, 0,.1)",
                }}
              >
                <p className="mb-2 fs18px fw-bold" style={{ color: "263238" }}>
                  <span>Project: </span>{" "}
                  {projects.find((project) => project.id === d.projectId)?.name}
                </p>
                <div className="row d-flex m-0">
                  <div className="col-auto">
                    <p
                      className="mb-0 mb-2 fs18px fw-bold me-3"
                      style={{ color: "#263238" }}
                    >
                      Officer Name
                    </p>
                    <p
                      className="mb-0 fw-normal me-3"
                      style={{ color: "#263238", fontWeight: "500" }}
                    >
                      {/* officer name id missing? */}
                      {
                        users.find((user) => user.id === d.submittedFrom)
                          ?.fullName
                      }
                      {d.submittedFrom}
                      <br />
                      <span>
                        (
                        {
                          users.find((user) => user.id === d.submittedFrom)
                            ?.designation
                        }
                        )
                      </span>
                    </p>
                  </div>
                  <div className="col">
                    <p
                      className="mb-0 mb-2 fs18px fw-bold me-3"
                      style={{ color: "#263238", fontWeight: "500" }}
                    >
                      Date
                    </p>
                    <p
                      className="mb-0 me-3"
                      style={{ color: "#263238", fontWeight: "500" }}
                    >
                      {addDayToFormattedDate(
                        getFormattedDate(new Date(d.sDate), "short")!
                      )}
                    </p>
                  </div>
                  <div className="col">
                    <p
                      className="mb-0 mb-2 fs18px fw-bold me-3"
                      style={{ color: "#263238" }}
                    >
                      Type
                    </p>
                    <p
                      className="mb-0 fw-normal me-3"
                      style={{ color: "#263238", fontWeight: "500" }}
                    >
                      {d.reportType === 0 ? "One Pager" : "Complete Report"}
                    </p>
                  </div>
                  <div className="col">
                    <p
                      className="mb-0 mb-2 fs18px fw-bold me-3"
                      style={{ color: "#263238", fontWeight: "500" }}
                    >
                      Status
                    </p>
                    <p
                      className="mb-0 fs14px me-3"
                      style={{ color: "#263238", fontWeight: "500" }}
                    >
                      {d.status === 0 ? (
                        <span
                          className="py-2 px-3 rounded-pill"
                          style={{ background: "#E3F0E7" }}
                        >
                          <Image
                            src={tickBgGreen}
                            alt="tickBgGreen"
                            className="mb-1"
                            width={14}
                            height={14}
                          />{" "}
                          Marked to Deputy Director
                        </span>
                      ) : d.status === 1 ? (
                        <span
                          className="py-2 px-3 rounded-pill"
                          style={{ background: "#E3F0E7" }}
                        >
                          <Image
                            src={tickBgGreen}
                            alt="tickBgGreen"
                            className="mb-1"
                            width={14}
                            height={14}
                          />{" "}
                          Approved by Deputy Director
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                  {/* hide comment button if status === 1 */}
                  <div className="col-auto d-flex justify-content-end align-items-end">
                    <CustomModal
                      isFullscreen={true}
                      modalId={`comment${d.id}`}
                      button={
                        <Button
                          className="btn shadow-none py-2 px-3 fs20px rounded-pill fw-bold"
                          style={{
                            background: "rgba(0, 57, 206,.05)",
                            color: "#0039CE",
                          }}
                        >
                          Comment
                        </Button>
                      }
                      body={<ReportNoting data={d} />}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default List;
