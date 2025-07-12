"use client";
import { REPORTS_HISTORY_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal";
import apiClient from "@/app/services/api-client";
import {
  addDayToFormattedDate,
  convertToLocaleTimeString,
  getFormattedDate,
} from "@/app/utils";
import search3 from "@/public/icons/search3.svg";
import Cookies from "js-cookie";
import { Raleway } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReportNoting from "../../components/ReportNoting";
import { APPROVED, ISSUED, REFERBACK, SUBMITTED } from "../../statuses";

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
  submittedDate: string;
  issuanceDate: string;
  reportType: number;
  intiallyUserId: number;
  intiallyUser: string;
  intiallyDesignation: string;
}

const List = () => {
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState<SubmittedReport[]>([]);

  const [userId, setUserId] = useState<number>();
  const [role, setRole] = useState<string>();
  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    const id = Cookies.get("userId");
    const role = Cookies.get("role");

    if (id) {
      const convertedId = parseInt(id);
      setUserId(convertedId);
    }
    if (role) setRole(role.toLowerCase());
  }, []);

  // State for filtered data
  const [filteredData, setFilteredData] = useState<SubmittedReport[]>([]);

  useEffect(() => {
    const handleSubmit = async (userId: number) => {
      try {
        const response = await apiClient.get(
          `${REPORTS_HISTORY_API}/GetSubmittedReports?submittedTo=${userId}`
        );
        setData(response.data.data);
        console.log("original data", response.data.data);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    if (userId) handleSubmit(userId);
  }, [userId, refresh]);

  useEffect(() => {
    if (data) {
      setSelectedTab(0);
      setFilteredData(data);
    }
  }, [data]);

  const tabs = [
    // {
    //   label: "All",
    //   status: -99,
    //   reportSubmittedFrom: userId,
    //   reportSubmittedTo: userId,
    //   direction: "both",
    //   tabKey: `-99-both-${userId}-${userId}`,
    // },
    {
      label: "SUBMITTED BY (AD)",
      status: SUBMITTED,
      role: "deputy director",
      reportSubmittedTo: userId,
      direction: "to",
      tabKey: `${SUBMITTED}-to-${userId}`,
    },
    {
      label: "SUBMITTED BY (DD)",
      status: SUBMITTED,
      role: "director",
      reportSubmittedTo: userId,
      direction: "from",
      tabKey: `${SUBMITTED}-to-${userId}`,
    },
    {
      label: "SUBMITTED TO (DIRECTOR)",
      status: SUBMITTED,
      role: "deputy director",
      reportSubmittedFrom: userId,
      direction: "from",
      tabKey: `${SUBMITTED}-from-${userId}`,
    },
    {
      label: "SUBMITTED TO (DG)",
      status: SUBMITTED,
      role: "director",
      reportSubmittedFrom: userId,
      direction: "to",
      tabKey: `${SUBMITTED}-to-${userId}`,
    },
    {
      label: "SUBMITTED BY (DIRECTOR)",
      status: SUBMITTED,
      role: "director general",
      reportSubmittedTo: userId,
      direction: "from",
      tabKey: `${SUBMITTED}-from-${userId}`,
    },
    {
      label: "APPROVED AND MARK TO (DIRECTOR)",
      status: APPROVED,
      role: "director general",
      reportSubmittedFrom: userId,
      direction: "to",
      tabKey: `${SUBMITTED}-to-${userId}`,
    },
    {
      label: "APPROVED BY (DG)",
      status: APPROVED,
      role: "director",
      reportSubmittedTo: userId,
      direction: "from",
      tabKey: `${APPROVED}-from-${userId}`,
    },
    {
      label: "APPROVED BY (DG)",
      status: APPROVED,
      role: "deputy director",
      reportSubmittedTo: userId,
      direction: "from",
      tabKey: `${APPROVED}-from-${userId}`,
    },
    {
      label: "REFERBACK BY (DIRECTOR)",
      status: REFERBACK,
      role: "deputy director",
      reportSubmittedTo: userId,
      direction: "to",
      tabKey: `${REFERBACK}-to-${userId}`,
    },
    {
      label: "REFERBACK TO (AD)",
      status: REFERBACK,
      role: "deputy director",
      reportSubmittedFrom: userId,
      direction: "from",
      tabKey: `${REFERBACK}-from-${userId}`,
    },
    {
      label: "REFERBACK BY (DG)",
      status: REFERBACK,
      role: "director",
      reportSubmittedTo: userId,
      direction: "from",
      tabKey: `${REFERBACK}-from-${userId}`,
    },
    {
      label: "REFERBACK TO (DD)",
      status: REFERBACK,
      role: "director",
      reportSubmittedFrom: userId,
      direction: "to",
      tabKey: `${REFERBACK}-to-${userId}`,
    },
    {
      label: "REFERBACK TO (DIRECTOR)",
      status: REFERBACK,
      role: "director general",
      reportSubmittedFrom: userId,
      direction: "to",
      tabKey: `${REFERBACK}-to-${userId}`,
    },
    // {
    //   label: "ISSUED",
    //   status: ISSUED,
    //   direction: undefined,
    //   tabKey: `${ISSUED}`,
    // },
  ];

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
          }}
        >
          <div className="row d-flex justify-content-between m-0">
            <div className="col-auto my-auto">
              <h5 className="fs18px fw-bold">List of Reports</h5>
            </div>

            <div className="col-auto">
              <div className="row d-flex m-0 justify-content-end mb-3">
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
                  <div className="col-auto">
                    <Button
                      className={`btn shadow-none rounded-0 fw-bold position-relative ${
                        selectedTab === 0 ? "text-dark" : "text-secondary"
                      }`}
                      style={{
                        borderBottom:
                          selectedTab === 0 ? "3px solid #0c8ce9" : "",
                      }}
                      onClick={() => {
                        setSelectedTab(0);
                        setFilteredData(data);
                      }}
                    >
                      All
                      {data?.filter(
                        (d) =>
                          d.submittedTo === userId || d.submittedFrom === userId
                      ).length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {
                            data?.filter(
                              (d) =>
                                d.submittedTo === userId ||
                                d.submittedFrom === userId
                            ).length
                          }
                        </span>
                      )}
                    </Button>
                  </div>
                  {tabs
                    .filter(
                      (tab) =>
                        tab.status === -99 ||
                        tab.status === 6 ||
                        tab.role === role
                    )
                    .map((tab, i) => {
                      const submittedId =
                        tab.direction === "from"
                          ? tab.reportSubmittedFrom
                          : tab.reportSubmittedTo;

                      return (
                        <div key={i + 1} className="col-auto">
                          <Button
                            className={`btn shadow-none rounded-0 fw-bold position-relative ${
                              selectedTab === i + 1
                                ? "text-dark"
                                : "text-secondary"
                            }`}
                            style={{
                              borderBottom:
                                selectedTab === i + 1
                                  ? "3px solid #0c8ce9"
                                  : "",
                            }}
                            onClick={() => {
                              setSelectedTab(i + 1);
                              if (tab.reportSubmittedFrom) {
                                setFilteredData(
                                  data.filter(
                                    (d) =>
                                      d.status === tab.status &&
                                      d.submittedFrom ===
                                        tab.reportSubmittedFrom
                                  )
                                );
                                console.log(
                                  "reportSubmittedFrom",
                                  data.filter(
                                    (d) =>
                                      d.status === tab.status &&
                                      d.submittedFrom ===
                                        tab.reportSubmittedFrom
                                  )
                                );
                              }
                              if (tab.reportSubmittedTo) {
                                setFilteredData(
                                  data.filter(
                                    (d) =>
                                      d.status === tab.status &&
                                      d.submittedTo === tab.reportSubmittedTo
                                  )
                                );
                                console.log(
                                  "reportSubmittedTo",
                                  data.filter(
                                    (d) =>
                                      d.status === tab.status &&
                                      d.submittedTo === tab.reportSubmittedTo
                                  )
                                );
                              }
                            }}
                          >
                            {tab.label}
                            {(tab.reportSubmittedFrom
                              ? data.filter(
                                  (d) =>
                                    d.status === tab.status &&
                                    d.submittedFrom === tab.reportSubmittedFrom
                                ).length
                              : tab.reportSubmittedTo
                              ? data.filter(
                                  (d) =>
                                    d.status === tab.status &&
                                    d.submittedTo === tab.reportSubmittedTo
                                ).length
                              : 0) > 0 && (
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {tab.reportSubmittedFrom
                                  ? data.filter(
                                      (d) =>
                                        d.status === tab.status &&
                                        d.submittedFrom ===
                                          tab.reportSubmittedFrom
                                    ).length
                                  : tab.reportSubmittedTo
                                  ? data.filter(
                                      (d) =>
                                        d.status === tab.status &&
                                        d.submittedTo === tab.reportSubmittedTo
                                    ).length
                                  : 0}
                              </span>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  <div className="col-auto">
                    <Button
                      className={`btn shadow-none rounded-0 fw-bold position-relative ${
                        selectedTab === tabs.length
                          ? "text-dark"
                          : "text-secondary"
                      }`}
                      style={{
                        borderBottom:
                          selectedTab === tabs.length
                            ? "3px solid #0c8ce9"
                            : "",
                      }}
                      onClick={() => {
                        setSelectedTab(tabs.length);
                        setFilteredData(
                          data?.filter((d) => d.status === ISSUED)
                        );
                      }}
                    >
                      Issued
                      {data?.filter((d) => d.status === ISSUED).length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {data?.filter((d) => d.status === ISSUED).length}
                        </span>
                      )}
                    </Button>
                  </div>
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
                      d.status === ISSUED
                        ? "bg-success text-light"
                        : d.status === REFERBACK
                        ? "bg-danger text-light"
                        : d.status === SUBMITTED
                        ? "bg-warning text-dark"
                        : "bg-info text-dark"
                    }`}
                  >
                    <p className="fw-5 mb-0">
                      <span className="fw-bold">Sr#</span> {i + 1}
                    </p>
                    <p className="fw-5 mb-0">
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
                          {convertToLocaleTimeString(
                            new Date(d.submittedDate).toLocaleTimeString()
                          )}
                        </p>
                      </div>

                      {selectedTab === tabs.length && (
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
                              {d.submittedTo === userId
                                ? "Comment"
                                : d.status === ISSUED
                                ? "Issued"
                                : d.status === APPROVED
                                ? "Approved"
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
