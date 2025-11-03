"use client";
import { REPORTS_HISTORY_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import Loader from "@/app/components/Loader";
import useOfficers, { Officer } from "@/app/hooks/useOfficers";
import useReportHistoryUser from "@/app/hooks/useReportHistoryUsers";
import apiClient, { AxiosError } from "@/app/services/api-client";
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
import { BsExclamationTriangleFill } from "react-icons/bs";
import ReportNoting from "../../components/ReportNoting";
import ViewHistoryOnly from "../../components/ViewHistoryOnly";
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

interface Tab {
  id: number;
  label: string;
  status: number;
  role: string;
  reportSubmittedFrom?: number;
  reportSubmittedTo?: number;
  count: number;
  filteredData: SubmittedReport[] | undefined;
}

const List = () => {
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState<SubmittedReport[]>([]);

  const [userId, setUserId] = useState<number>();
  const [role, setRole] = useState<string>();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedTabLabel, setSelectedLabel] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    console.log("selectedTab", selectedTab);
  }, [selectedTab]);

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
  const [filteredData, setFilteredData] = useState<
    SubmittedReport[] | undefined
  >();

  useEffect(() => {
    const handleSubmit = async (userId: number) => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          `${REPORTS_HISTORY_API}/GetSubmittedReports?submittedTo=${userId}`
        );
        if (response.data.data) {
          console.log("response.data.data", response.data.data);
          const sortedData = response.data.data.sort(
            (a: any, b: any) =>
              new Date(a.submittedDate).getTime() -
              new Date(b.submittedDate).getTime()
          );
          setData(sortedData);
          console.log("sortedData data", sortedData);
        }
        console.log("original data", response.data.data);
        setLoading(false);
      } catch (err) {
        setError((err as AxiosError).message);
        console.error("Submission error:", err);
        setLoading(false);
      }
    };
    if (userId) handleSubmit(userId);
  }, [userId, refresh]);

  const { data: users } = useReportHistoryUser({ refresh });
  const { data: officers } = useOfficers({ refresh });
  const [deputyDirectors, setdeputyDirectors] = useState<Officer[]>();
  const [directors, setDirectors] = useState<Officer[]>();
  const [departmentHead, setDepartmentHead] = useState<Officer>();

  useEffect(() => {
    if (officers) {
      const deputyDirectors = officers.filter(
        (officer) => officer.roleName === "Deputy Director"
      );
      console.log(deputyDirectors);
      if (deputyDirectors) setdeputyDirectors(deputyDirectors);

      const directors = officers.filter(
        (officer) => officer.roleName === "Director"
      );
      console.log(directors);
      if (directors) setDirectors(directors);

      const departmentHead = officers.find(
        (officer) => officer.roleName === "Department Head"
      );

      console.log(departmentHead);
      if (departmentHead) setDepartmentHead(departmentHead);
    }
  }, [officers]);

  const [tabs, setTabs] = useState<Tab[]>();

  useEffect(() => {
    const tabs = [
      // {
      // id: 0,
      //   label: "All",
      //   status: -99,
      //   reportSubmittedFrom: userId,
      //   reportSubmittedTo: userId,
      //   filteredData:data;
      // },
      {
        id: 1,
        label: "SUBMITTED BY (AD)",
        status: SUBMITTED,
        role: "deputy director",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 2,
        label: "SUBMITTED BY (DD)",
        status: SUBMITTED,
        role: "director",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 3,
        label: "SUBMITTED TO (DIRECTOR)",
        status: SUBMITTED,
        role: "deputy director",
        reportSubmittedFrom: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 4,
        label: "SUBMITTED TO (DG)",
        status: SUBMITTED,
        role: "director",
        reportSubmittedFrom: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 5,
        label: "SUBMITTED BY (DIRECTOR)",
        status: SUBMITTED,
        role: "department head",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 6,
        label: "APPROVED AND MARK TO (DIRECTOR)",
        status: APPROVED,
        role: "department head",
        reportSubmittedFrom: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 7,
        label: "APPROVED BY (DG)",
        status: APPROVED,
        role: "director",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 8,
        label: "APPROVED BY (DG)",
        status: APPROVED,
        role: "deputy director",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 9,
        label: "REFERBACK BY (DIRECTOR)",
        status: REFERBACK,
        role: "deputy director",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 10,
        label: "REFERBACK TO (AD)",
        status: REFERBACK,
        role: "deputy director",
        reportSubmittedFrom: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 11,
        label: "REFERBACK BY (DG)",
        status: REFERBACK,
        role: "director",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 12,
        label: "REFERBACK TO (DD)",
        status: REFERBACK,
        role: "director",
        reportSubmittedFrom: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 13,
        label: "REFERBACK TO (DIRECTOR)",
        status: REFERBACK,
        role: "department head",
        reportSubmittedFrom: userId,
        count: 0,
        filteredData: undefined,
      },
      // {
      // id: 14,
      //   label: "ISSUED",
      //   status: ISSUED,
      //   direction: undefined,
      //   tabKey: `${ISSUED}`,
      //   count: 0,
      // },
    ];

    if (data) {
      const updatedTabs: Tab[] = tabs.map((tab) => {
        let count = 0;
        let filteredData: SubmittedReport[] = [];

        if (tab.reportSubmittedFrom) {
          filteredData = data.filter(
            (d) =>
              d.status === tab.status &&
              d.submittedFrom === tab.reportSubmittedFrom
          );
          count = filteredData.length;
        } else if (tab.reportSubmittedTo) {
          filteredData = data.filter(
            (d) =>
              d.status === tab.status && d.submittedTo === tab.reportSubmittedTo
          );
          count = filteredData.length;
        }

        return { ...tab, count, filteredData };
      });
      if (updatedTabs) setTabs(updatedTabs);
    }
  }, [data]);

  useEffect(() => {
    if (tabs) {
      const tabWithRecord = tabs.find(
        (tab) =>
          tab.role === role &&
          tab.count > 0 &&
          // DD Tabs
          (tab.id === 1 ||
            tab.id === 8 ||
            tab.id === 9 ||
            // Director Tabs
            tab.id === 2 ||
            tab.id === 7 ||
            tab.id === 11 ||
            // Department Head Tabs
            tab.id === 5)
      );
      if (tabWithRecord) {
        setSelectedTab(tabWithRecord.id);
        setSelectedLabel(tabWithRecord.label);
        setFilteredData(tabWithRecord.filteredData);
      } else {
        setSelectedTab(0);
        setSelectedLabel("All");
        setFilteredData(data);
      }
    }
  }, [tabs, role]);

  console.log("tabs", tabs);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <BsExclamationTriangleFill size={24} className="me-2" />
          <div>{error}, Please Try Again!</div>
        </div>
      ) : userId && role && data && data.length > 0 ? (
        // ✅ render your data block here
        <div
          className={`container-fluid p-3 mt-3 mb-4 ${raleway.className}`}
          style={{
            background:
              "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6) , rgba(255, 255, 255, 0.08))",
            border: "1px solid rgba(255, 255, 255, 0.29)",
            borderRadius: "15px",
          }}
        >
          <div className="row d-flex justify-content-between">
            <div className="col-auto my-auto">
              <h5 className="fs18px fw-bold">List of Reports</h5>
            </div>

            <div className="col-auto">
              <div className="row d-flex justify-content-end mb-3">
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
            <div className="row d-flex mb-3">
              <div className="col">
                <div className="row d-flex">
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
                        setSelectedLabel("All");
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
                    ?.filter(
                      (tab) =>
                        tab.status === -99 ||
                        tab.status === 6 ||
                        tab.role === role
                    )
                    .map((tab) => (
                      <div key={tab.id} className="col-auto">
                        <Button
                          className={`btn shadow-none rounded-0 fw-bold position-relative ${
                            selectedTab === tab.id
                              ? "text-dark"
                              : "text-secondary"
                          }`}
                          style={{
                            borderBottom:
                              selectedTab === tab.id ? "3px solid #0c8ce9" : "",
                          }}
                          onClick={() => {
                            setSelectedTab(tab.id);
                            setSelectedLabel(tab.label);
                            setFilteredData(tab.filteredData);
                            console.log("tab filteredData", tab.filteredData);
                          }}
                        >
                          {tab.label}
                          {tab.count > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                              {tab.count}
                            </span>
                          )}
                        </Button>
                      </div>
                    ))}
                  {/* <div className="col-auto">
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
                        setSelectedLabel("Issued")
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
                  </div> */}
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
            <div key={i} className="col mb-2 position-relative overflow-hidden">
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
                    <div className="row d-flex justify-content-between align-items-center mb-2">
                      <div className="col">
                        <p
                          className="fs18px fw-bold m-0"
                          style={{ color: "263238" }}
                        >
                          <span>Project: </span> {d.projectName}
                        </p>
                      </div>
                      <div className="col-auto px-5">&nbsp;</div>
                      <div
                        className="col-auto position-absolute p-0"
                        style={{
                          rotate: "45deg",
                          top: 40,
                          right: -40,
                        }}
                      >
                        {d.reportType === 1 ? (
                          <span
                            className="badge px-5 fw-bold py-2 fs-6"
                            style={{ backgroundColor: "#3B7C80" }}
                          >
                            MONITORING
                          </span>
                        ) : d.reportType === 0 ? (
                          <span className="badge bg-color-evaluation-theme-blue px-5 fw-bold py-2 fs-6">
                            EVALUATION
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="row d-flex justify-content-between">
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

                      {selectedTab === tabs?.length && (
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

                      {selectedTabLabel === "All" ? (
                        <div className="col d-flex justify-content-end align-items-end pe-5">
                          <CustomModal
                            isFullscreen={true}
                            modalId={`view-history${d.id}`}
                            buttonColumn="col-auto"
                            button={
                              <Button
                                className="btn shadow-sm py-2 px-3 fs20px rounded-pill fw-bold"
                                style={{
                                  background: "rgba(0, 57, 206,.05)",
                                  color: "#0039CE",
                                }}
                              >
                                View History
                              </Button>
                            }
                            body={
                              <div className="container-fluid p-3">
                                <div
                                  className="col"
                                  style={{
                                    backgroundImage: "url('/images/bg2.png')",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    border:
                                      "1px solid rgba(255, 255, 255, 0.29)",
                                    borderRadius: "15px",
                                    height: "100%",
                                  }}
                                >
                                  <div
                                    className="col"
                                    style={{
                                      backgroundImage:
                                        "linear-gradient(to bottom right, rgba(239, 239, 239,.6) , rgba(255, 255, 255,.08))",
                                      borderRadius: "15px",
                                      padding: "34px 50px",
                                      width: "100%",
                                      height: "100%",
                                    }}
                                  >
                                    <ViewHistoryOnly data={d} users={users} />
                                  </div>
                                </div>
                              </div>
                            }
                          />
                        </div>
                      ) : (
                        <div className="col d-flex justify-content-end align-items-end pe-5">
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
                              <>
                                {deputyDirectors &&
                                  directors &&
                                  departmentHead && (
                                    <ReportNoting
                                      data={d}
                                      setRefresh={setRefresh}
                                      role={role}
                                      userId={userId}
                                      selectedTabLabel={selectedTabLabel}
                                      users={users}
                                      deputyDirectors={deputyDirectors}
                                      directors={directors}
                                      departmentHead={departmentHead}
                                      officers={officers}
                                    />
                                  )}
                              </>
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="alert alert-warning d-flex align-items-center"
          role="alert"
        >
          <BsExclamationTriangleFill size={24} className="me-2" />
          <div>No reports found.</div>
        </div>
      )}
    </>
  );
};

export default List;
