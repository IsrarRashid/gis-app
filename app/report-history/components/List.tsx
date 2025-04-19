"use client";
import { reportsHistoryAPI } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal";
import useReportHistoryUser from "@/app/hooks/useReportHistoryUsers";
import apiClient from "@/app/services/api-client";
import { addDayToFormattedDate, getFormattedDate } from "@/app/utils";
import search3 from "@/public/icons/search3.svg";
import Cookies from "js-cookie";
import { Raleway } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReportNoting from "./ReportNoting";

const raleway = Raleway({
  subsets: ["latin"],
});

export interface SubmittedReport {
  id: number;
  visitId: number;
  projectId: number;
  submittedFrom: number;
  submittedTo: number;
  remarks: string;
  projectName: string;
  gsNo: string;
  reportPath: string;
  status: number;
  sDate: string;
  submittedDate: string;
  issuanceDate: string;
  reportType: number;
  lastStatus: number;
  intiallyUserId: number;
  intiallyUser: string;
  intiallyDesignation: string;
}

export const ONE_PAGER_REPORT_ID = 0;
export const COMPLETE_REPORT_ID = 1;
// happy path
export const SUBMITTED_BY_AD_TO_DD = 0;
export const REVIEWED_AND_FORWARD_BY_DD_TO_D = 1;
export const REVIEWED_AND_FORWARD_BY_D_TO_DG = 2;
export const REVIEWED_AND_APPROVED_BY_DG_TO_D = 3;
export const APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE = 4;
export const APPROVED_BY_DG_AND_FORWARD_BY_DD_TO_AD_FOR_ISSUEANCE = 5;
export const ISSUED_By_AD = 6;

// edge cases
export const DD_REFERBACK_ID = -1;
export const D_REFERBACK_ID = -2;
export const DG_REFERBACK_ID = -3;
export const RESUBMITTED_BY_AD = 7;

const List = () => {
  const [refresh, setRefresh] = useState(false);
  // useAuthorization("report-history");
  const [data, setData] = useState<SubmittedReport[]>([]);
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
    if (role) setRole(role.toLowerCase());
  }, []);

  const [status, setStatus] = useState(0);

  const [selectedButton, setSelectedButton] = useState(0);
  // State for filtered data
  const [filteredData, setFilteredData] = useState<SubmittedReport[]>([]);

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

  const handleFilterData = (
    data: SubmittedReport[],
    status: number,
    submittedFrom: number,
    submittedTo: number
  ) => {
    if (role === "deputy director" && status === -99) {
      setStatus(status);
      setFilteredData(data?.filter((d) => d.submittedTo === submittedTo));
    } else if (status === -99) {
      setStatus(status);
      setFilteredData(
        data?.filter(
          (d) =>
            d.submittedFrom === submittedFrom && d.submittedTo === submittedTo
        )
      );
    } else {
      setStatus(status);
      setFilteredData(
        data?.filter(
          (d) =>
            d.lastStatus === status &&
            d.submittedFrom === submittedFrom &&
            d.submittedTo === submittedTo
        )
      );
    }
  };

  useEffect(() => {
    console.log("filteredData", filteredData);
    console.log("data", data);
  }, [filteredData]);

  const DDM_USER_ID = 28;
  const DM_USER_ID = 26;
  const DE_USER_ID = 27;
  const DDE_USER_ID = 29;
  const DG_USER_ID = 50;

  const tabs = [
    {
      label: "All",
      status: -99,
      submittedFrom:
        role === "deputy director"
          ? -99
          : role === "director"
          ? DG_USER_ID
          : role === "director general"
          ? DM_USER_ID
          : -99,
      submittedTo:
        role === "deputy director"
          ? DDM_USER_ID
          : role === "director"
          ? DM_USER_ID
          : role === "director general"
          ? DG_USER_ID
          : -99,
    },
    {
      label: "SUBMITTED BY (AD)",
      status: SUBMITTED_BY_AD_TO_DD,
      role: "deputy director",
      submittedFrom: -99,
      submittedTo: DM_USER_ID,
    }, // FOR DD
    {
      label: "SUBMITTED BY (DD)",
      status: REVIEWED_AND_FORWARD_BY_DD_TO_D,
      role: "director",
      submittedFrom: DDM_USER_ID,
      submittedTo: DG_USER_ID,
    }, // FOR D
    {
      label: "SUBMITTED TO (DIRECTOR)",
      status: REVIEWED_AND_FORWARD_BY_DD_TO_D,
      role: "deputy director",
      submittedFrom: DDM_USER_ID,
      submittedTo: DM_USER_ID,
    }, // FOR DD
    {
      label: "SUBMITTED TO (DG)",
      status: REVIEWED_AND_FORWARD_BY_D_TO_DG,
      role: "director",
      submittedFrom: DDM_USER_ID,
      submittedTo: DG_USER_ID,
    }, // FOR D
    {
      label: "SUBMITTED BY (DIRECTOR)",
      status: REVIEWED_AND_FORWARD_BY_D_TO_DG,
      role: "director general",
      submittedFrom: DM_USER_ID,
      submittedTo: DG_USER_ID,
    }, // FOR DG
    {
      label: "SUBMITTED TO (DIRECTOR)",
      status: REVIEWED_AND_APPROVED_BY_DG_TO_D,
      role: "director general",
      submittedFrom: DG_USER_ID,
      submittedTo: DM_USER_ID,
    }, // FOR D
    {
      label: "APPROVED BY (DG)",
      status: REVIEWED_AND_APPROVED_BY_DG_TO_D,
      role: "director",
      submittedFrom: DG_USER_ID,
      submittedTo: DM_USER_ID,
    }, // FOR D
    {
      label: "APPROVED BY (DG)",
      status: APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE,
      role: "deputy director",
      submittedFrom: DM_USER_ID,
      submittedTo: DDM_USER_ID,
    }, // FOR DD
    {
      label: "REFERBACK BY (DIRECTOR)",
      status: D_REFERBACK_ID,
      role: "deputy director",
      submittedFrom: DM_USER_ID,
      submittedTo: -99,
    }, // FOR DD
    {
      label: "REFERBACK TO (AD)",
      status: DD_REFERBACK_ID,
      role: "deputy director",
      submittedFrom: DDM_USER_ID,
      submittedTo: -99,
    }, // FOR DD
    {
      label: "REFERBACK BY (DG)",
      status: DG_REFERBACK_ID,
      role: "director",
      submittedFrom: DG_USER_ID,
      submittedTo: DDM_USER_ID,
    }, // FOR D
    {
      label: "REFERBACK TO (DD)",
      status: D_REFERBACK_ID,
      role: "director",
      submittedFrom: DM_USER_ID,
      submittedTo: DDM_USER_ID,
    }, // FOR D
    {
      label: "REFERBACK TO (DIRECTOR)",
      status: DG_REFERBACK_ID,
      role: "director general",
      submittedFrom: DG_USER_ID,
      submittedTo: DM_USER_ID,
    }, // FOR D
    {
      label: "ISSUED",
      status: ISSUED_By_AD,
      submittedFrom: -99,
      submittedTo: -99,
    }, // FOR ALL
  ];

  // const tabs = [
  //   { label: "All", status: -99 },
  //   { label: "SUBMITTED BY (AD)", status: 0 }, // FOR DD
  //   { label: "SUBMITTED BY (DD)", status: 1 },
  //   { label: "SUBMITTED TO (DIRECTOR)", status: 1 }, // FOR DD
  //   { label: "SUBMITTED TO (DG)", status: 2 },
  //   { label: "APPROVED BY (DG)", status: 2 },
  //   { label: "ISSUED", status: 6 },
  //   { label: "REFERBACK BY (DIRECTOR)", status: -2 }, // FOR DD
  //   { label: "REFERBACK TO (AD)", status: -1 }, // FOR DD
  // ];

  useEffect(() => {
    if (data && role && userId) {
      const currentStatus =
        role === "deputy director"
          ? 0
          : role === "director"
          ? 1
          : role === "director general"
          ? 2
          : -99;

      const currentSubmittedFrom =
        role === "deputy director"
          ? DM_USER_ID
          : role === "director"
          ? DG_USER_ID
          : role === "director general"
          ? DM_USER_ID
          : -99;

      setSelectedButton(currentStatus);
      handleFilterData(data, currentStatus, currentSubmittedFrom, userId);
    }
  }, [data, role, userId]);

  return (
    <>
      {userId && role && data && (
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
          <div className="row d-flex justify-content-between m-0">
            <div className="col-auto my-auto">
              <h5 className="fs18px fw-bold">List of Reports</h5>
            </div>

            <div className="col-auto">
              <div className="row d-flex m-0 justify-content-end mb-3">
                {/* <div className="col-auto text-start">
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
              </div> */}
                <div className="col">
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
          <div className="col m-auto">
            <div className="row d-flex m-0 mb-3">
              <div className="col">
                <div className="row d-flex m-0">
                  {tabs
                    .filter(
                      (tab) =>
                        tab.status === -99 ||
                        tab.status === 6 ||
                        tab.role === role
                    )
                    .map((tab) => (
                      <div key={tab.status} className="col-auto">
                        <Button
                          className={`btn shadow-none rounded-0 fw-bold position-relative ${
                            selectedButton === tab.status
                              ? "text-dark"
                              : "text-secondary"
                          }`}
                          style={{
                            borderBottom: `${
                              selectedButton === tab.status
                                ? "3px solid #0c8ce9"
                                : ""
                            }`,
                          }}
                          onClick={() => {
                            setSelectedButton(tab.status);
                            handleFilterData(
                              data,
                              tab.status,
                              tab.submittedFrom,
                              tab.submittedTo
                            );
                          }}
                        >
                          {tab.label}
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {tab.status === -99 && role === "deputy director"
                              ? data?.filter(
                                  (d) => d.submittedTo === tab.submittedTo
                                ).length
                              : tab.status === -99
                              ? data?.filter(
                                  (d) =>
                                    d.submittedFrom === tab.submittedFrom &&
                                    d.submittedTo === tab.submittedTo
                                ).length
                              : tab.status === 6
                              ? data?.filter((d) => d.lastStatus === tab.status)
                                  .length
                              : data?.filter(
                                  (d) =>
                                    d.lastStatus === tab.status &&
                                    tab.role === role &&
                                    d.submittedFrom === tab.submittedFrom
                                ).length}
                          </span>
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
              {/* <div className="col-lg-4 col-md-6 col-sm-12 text-auto">
                        <form onSubmit={(e) => e.preventDefault()}>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control border-0 rounded-pill rounded-end"
                              style={{
                                background: "rgba(16, 143, 168, .1)",
                                outline: "none",
                                border: "1px solid #D0D5DD",
                              }}
                              placeholder="Search"
                              value={searchTerm}
                              onChange={handleChange}
                            />
                            <button
                              className="btn rounded-start rounded-pill bg-color-sea-green text-white"
                              type="submit"
                            >
                              <IoSearch className="mb-1" style={{ color: "#fff" }} />
                            </button>
                          </div>
                        </form>
                      </div> */}
            </div>
          </div>
          {filteredData?.map((d, i) => (
            <div key={d.id} className="col mb-2">
              <div
                className="col p-3"
                style={{
                  background: "#FAFAFA",
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 0, 0,.1)",
                }}
              >
                <div className="row m-0">
                  <div
                    className={`col-auto rounded-3 p-3 ${
                      d.lastStatus === ISSUED_By_AD
                        ? "bg-success text-light"
                        : d.lastStatus === DD_REFERBACK_ID ||
                          d.lastStatus === D_REFERBACK_ID ||
                          d.lastStatus === DG_REFERBACK_ID
                        ? "bg-danger text-light"
                        : d.lastStatus === SUBMITTED_BY_AD_TO_DD ||
                          d.lastStatus === REVIEWED_AND_FORWARD_BY_DD_TO_D ||
                          d.lastStatus === REVIEWED_AND_FORWARD_BY_D_TO_DG
                        ? "bg-warning text-dark"
                        : "bg-info text-dark"
                    }`}
                  >
                    <p className="fw-5">
                      <span className="fw-bold">Sr#</span> {i + 1}
                    </p>
                    <p className="fw-5">
                      <span className="fw-bold">GS No. </span>
                      {d.gsNo}
                    </p>
                  </div>
                  <div className="col">
                    <p
                      className="mb-2 fs18px fw-bold"
                      style={{ color: "263238" }}
                    >
                      <span>Project: </span> {d.projectName}
                    </p>
                    <div className="row d-flex justify-content-between m-0">
                      <div className="col">
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
                          {d.intiallyUser}
                          <br />
                          <span>({d.intiallyDesignation})</span>
                        </p>
                      </div>
                      <div className="col">
                        <p
                          className="mb-0 mb-2 fs18px fw-bold me-3"
                          style={{ color: "#263238", fontWeight: "500" }}
                        >
                          Submitted Date
                        </p>
                        <p
                          className="mb-0 me-3"
                          style={{ color: "#263238", fontWeight: "500" }}
                        >
                          {addDayToFormattedDate(
                            getFormattedDate(
                              new Date(d.submittedDate),
                              "short"
                            )!
                          )}
                          <br />
                          show time as well
                        </p>
                      </div>

                      {status === 6 && (
                        <div className="col">
                          <p
                            className="mb-0 mb-2 fs18px fw-bold me-3"
                            style={{ color: "#263238", fontWeight: "500" }}
                          >
                            Issued Date
                          </p>
                          <p
                            className="mb-0 me-3"
                            style={{ color: "#263238", fontWeight: "500" }}
                          >
                            {addDayToFormattedDate(
                              getFormattedDate(
                                new Date(d.issuanceDate),
                                "short"
                              )!
                            )}
                          </p>
                        </div>
                      )}
                      {/* <div className="col-auto mb-2">
                  <p
                    className="mb-2 fs18px fw-bold"
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
                </div> */}
                      {/* hide comment button if status === 1 */}
                      <div className="col d-flex justify-content-end align-items-end">
                        <CustomModal
                          isFullscreen={true}
                          modalId={`comment${d.id}`}
                          buttonColumn="col-auto"
                          button={
                            <Button
                              className="btn shadow-sm py-2 px-3 fs20px rounded-pill fw-bold"
                              style={{
                                background: "rgba(0, 57, 206,.05)",
                                color: "#0039CE",
                              }}
                            >
                              {(role === "deputy director" &&
                                d.lastStatus === SUBMITTED_BY_AD_TO_DD) ||
                              (role === "deputy director" &&
                                d.lastStatus === D_REFERBACK_ID) ||
                              (role === "deputy director" &&
                                d.lastStatus ===
                                  APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE) ||
                              (role === "director" &&
                                d.lastStatus ===
                                  REVIEWED_AND_FORWARD_BY_DD_TO_D) ||
                              (role === "director" &&
                                d.lastStatus ===
                                  REVIEWED_AND_APPROVED_BY_DG_TO_D) ||
                              (role === "director general" &&
                                d.lastStatus ===
                                  REVIEWED_AND_FORWARD_BY_D_TO_DG)
                                ? "Comment"
                                : d.lastStatus === ISSUED_By_AD
                                ? "Issued"
                                : "Submitted"}
                            </Button>
                          }
                          body={
                            <ReportNoting
                              data={d}
                              setRefresh={setRefresh}
                              refresh={refresh}
                              role={role}
                              userId={userId}
                            />
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default List;
