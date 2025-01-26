"use client";
import { reportsHistoryAPI } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal";
import useProjects from "@/app/hooks/useProjects";
import useReportHistoryUser from "@/app/hooks/useReportHistoryUsers";
import apiClient from "@/app/services/api-client";
import { addDayToFormattedDate, getFormattedDate } from "@/app/utils";
import search3 from "@/public/icons/search3.svg";
import Cookies from "js-cookie";
import { Raleway } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import RenderStatusBadge from "./RenderStatusBadge";
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
  lastStatus: number;
  submittedUser: number;
  sDate: string;
  reportType: number;
}

export const ONE_PAGER_REPORT_ID = 0;
export const COMPLETE_REPORT_ID = 1;
// happy path
export const ASSISTANT_DIRECTOR_SUBMITTED_ID = 0;
export const DEPUTY_DIRECTOR_APPROVED_ID = 1;
export const DIRECTOR_APPROVED_ID = 2;
export const DEPUTY_DIRECTOR_APPROVED_AND_ALLOW_ISSUE_ID = 3;
export const ASSISTANT_DIRECTOR_ISSUED_ID = 4;

// edge cases
export const DEPUTY_DIRECTOR_REFERBACK_ID = -1;
export const DIRECTOR_REFERBACK_ID = -2;
export const ASSISTANT_DIRECTOR_RESUBMITTED_ID = 5;

const List = () => {
  const [refresh, setRefresh] = useState(false);
  // useAuthorization("report-history");
  const [data, setData] = useState<ReportHistory[]>();
  const [userId, setUserId] = useState<number>();
  const [role, setRole] = useState<string>();
  // const [reportHistoryList, setReportHistoryList] = useState<ReportHistory[]>();
  const { data: users } = useReportHistoryUser({ refresh });
  // const [singleProjectData, setSingleProjectData] =
  //   useState<SingleProjectLessData>();

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
    const role = Cookies.get("role");
    if (id) setUserId(parseInt(id));
    if (role) setRole(role);
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

  const getReportHistory = async (visitId: number, projectId: number) => {
    try {
      const response = await apiClient.get(
        `${reportsHistoryAPI}/GetReportHistory?visitId=${visitId}&ProjectId=${projectId}`
      );
      // setReportHistoryList(response.data.data);
      return response.data.data.status;
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

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
                <div className="row d-flex justify-content-between m-0">
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
                  <div className="col-auto">
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
                  <div className="col-auto">
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
                      {d.reportType === ONE_PAGER_REPORT_ID
                        ? "One Pager"
                        : "Complete Report"}
                    </p>
                  </div>
                  <div className="col-auto mb-2">
                    <p
                      className="mb-0 mb-2 fs18px fw-bold"
                      style={{ color: "#263238", fontWeight: "500" }}
                    >
                      Last Status
                    </p>
                    <p
                      className="mb-0 fs14px"
                      style={{ color: "#263238", fontWeight: "500" }}
                    >
                      <RenderStatusBadge status={d.lastStatus} />
                    </p>
                  </div>
                  {/* hide comment button if status === 1 */}
                  {role && (
                    <div className="col-auto d-flex justify-content-end align-items-end">
                      <CustomModal
                        isFullscreen={true}
                        modalId={`comment${d.id}`}
                        button={
                          <Button
                            className="btn shadow-sm py-2 px-3 fs20px rounded-pill fw-bold"
                            style={{
                              background: "rgba(0, 57, 206,.05)",
                              color: "#0039CE",
                            }}
                          >
                            {(role.toLowerCase() === "deputy director" &&
                              d.lastStatus ===
                                ASSISTANT_DIRECTOR_SUBMITTED_ID) ||
                            (role.toLowerCase() === "deputy director" &&
                              d.lastStatus === DIRECTOR_REFERBACK_ID) ||
                            (role.toLowerCase() === "deputy director" &&
                              d.lastStatus === DIRECTOR_APPROVED_ID) ||
                            (role.toLowerCase() === "director" &&
                              d.lastStatus === DEPUTY_DIRECTOR_APPROVED_ID)
                              ? "Comment"
                              : d.lastStatus === ASSISTANT_DIRECTOR_ISSUED_ID
                              ? "Issued"
                              : "Submitted"}
                          </Button>
                        }
                        body={
                          <ReportNoting
                            data={d}
                            setRefresh={setRefresh}
                            refresh={refresh}
                          />
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default List;
