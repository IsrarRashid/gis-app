"use client";
import { reportsHistoryAPI } from "@/app/APIs";
import Button from "@/app/components/Button";
import useOfficers from "@/app/hooks/useOfficers";
import useProjects from "@/app/hooks/useProjects";
import useReportHistoryUser from "@/app/hooks/useReportHistoryUsers";
import apiClient from "@/app/services/api-client";
import { addDayToFormattedDate, getFormattedDate } from "@/app/utils";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import HistoryList from "./HistoryList";
import { ReportHistory } from "./List";

interface Props {
  data: ReportHistory;
}

const ReportNoting = ({ data }: Props) => {
  const [refresh, setRefresh] = useState(false);
  const { data: users } = useReportHistoryUser({ refresh });
  const { data: projects } = useProjects({ refresh });
  const { data: officers } = useOfficers({ refresh });
  const [reportsHistory, setReportsHistory] = useState<ReportHistory[]>();

  const handleMarkedReport = async (data: ReportHistory) => {
    try {
      const response = await apiClient.post(
        `${reportsHistoryAPI}/MarkedReport`,
        data
      );
      console.log("marked report: ", response.data.data);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    const getReportHistory = async (visitId: number, projectId: number) => {
      try {
        const response = await apiClient.get(
          `${reportsHistoryAPI}/GetReportHistory?visitId=${visitId}&ProjectId=${projectId}`
        );
        setReportsHistory(response.data.data);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };

    getReportHistory(data.visitId, data.projectId);
  }, [data]);

  const [userId, setUserId] = useState<number>();
  const [role, setRole] = useState<string>();
  const [selectedOfficerId, setSelectedOfficerId] = useState<number>(13);
  const [remarks, setRemarks] = useState<string>("Approved and Please Issued");

  useEffect(() => {
    const id = Cookies.get("userId");
    const role = Cookies.get("role");
    if (id) setUserId(parseInt(id));
    if (role) setRole(role);
  }, []);

  return (
    <div className="container-fluid p-3">
      <div
        className="col"
        style={{
          backgroundImage: "url('/images/bg2.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          border: "1px solid rgba(255, 255, 255, 0.29)",
          borderRadius: "15px",
          height: "95vh",
        }}
      >
        <div
          className="col"
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, rgba(239, 239, 239,.6) , rgba(255, 255, 255,.08))",
            borderRadius: "15px",
            padding: "34px 70px",
            width: "100%",
            height: "100%",
          }}
        >
          <div className="row d-flex m-0">
            <div className="col-lg-4">
              <div
                className="col p-4 me-1"
                style={{
                  background: "#FAFAFA",
                  borderRadius: "12px",
                }}
              >
                <div className="row d-flex m-0 mb-2">
                  {/* <div className="col">
                  <Image src={pencil} alt="pencil" width={33} height={33} />
                </div> */}
                  <div className="col text-end">
                    <Link
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_BACKEND_API}${data.reportPath}`}
                      className="btn rounded-pill fs15px"
                      style={{ background: "#E4E4E4" }}
                    >
                      Veiw {data.reportType === 0 ? "One Pager" : "Complete"}{" "}
                      Report
                    </Link>
                  </div>
                </div>
                <h1 className="fw-bold" style={{ fontSize: "36px" }}>
                  {
                    users.find((user) => user.id === data.submittedFrom)
                      ?.fullName
                  }{" "}
                </h1>
                <p
                  className="mb-2 fs18px fw-normal"
                  style={{ color: "#1E1E1E", opacity: 0.8 }}
                >
                  {
                    users.find((user) => user.id === data.submittedFrom)
                      ?.designation
                  }
                </p>
                {/* <p
                className="mb-2 fs18px fw-normal"
                style={{ color: "#1E1E1E", opacity: 0.8 }}
              >
                Submitted To :{" "}
                {users.find((user) => user.id === data.submittedTo)?.userName}
              </p> */}
                <p
                  className="mb-2 fs18px fw-normal"
                  style={{ color: "#1E1E1E", opacity: 0.8 }}
                >
                  Marked from :{" "}
                  {
                    users.find((user) => user.id === data.submittedFrom)
                      ?.fullName
                  }
                </p>
                <hr className="mb-4" style={{ opacity: ".1" }} />
                <div className="row d-flex m-0 mb-3">
                  <div className="col">
                    <p
                      className="mb-2 fw-normal"
                      style={{ color: "#1E1E1E", opacity: 0.6 }}
                    >
                      Last modification:&nbsp;
                      {addDayToFormattedDate(
                        getFormattedDate(new Date(data.sDate), "short")!
                      )}
                    </p>
                  </div>
                  {/* <div className="col-auto">
                    <CustomModal
                      isFullscreen={true}
                      modalId="viewHistory"
                      button={
                        <Button
                          onClick={() =>
                            handleViewHistory(data.visitId, data.projectId)
                          }
                          className="btn text-decoration-none rounded-pill"
                          style={{ color: "#0039CE" }}
                        >
                          View History
                        </Button>
                      }
                      body={
                        reportsHistory && <Temporary data={reportsHistory} />
                      }
                    />
                  </div> */}
                </div>
                <Button className="btn bg-color-sea-blue fs18px rounded-pill text-white w-100 py-3 mb-2 fw-bold">
                  <IoArrowBack size={21} />
                  &nbsp;&nbsp;&nbsp;Back
                </Button>
                {/* <Button
                className="btn fs18px rounded-pill w-100 py-3 mb-2 fw-bold"
                style={{ background: "rgba(38, 50, 56,.05)" }}
              >
                <IoArrowBack size={21} />
                &nbsp;&nbsp;&nbsp;Back
              </Button> */}
              </div>
            </div>
            <div className="col-lg-8">
              {reportsHistory && <HistoryList data={reportsHistory} />}
              <div
                className="col p-4 ms-1 mb-3"
                style={{
                  background: "#FAFAFA",
                  borderRadius: "12px",
                }}
              >
                <p className="mb-4 fw-normal">
                  <span>Project:&nbsp;&nbsp;</span>{" "}
                  {
                    projects.find((project) => project.id === data.projectId)
                      ?.name
                  }
                </p>
                <hr style={{ opacity: ".1" }} />
                <p className="mb-1 fw-normal fs18px">Description Level</p>
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    style={{ borderRadius: "12px" }}
                    id="exampleFormControlTextarea1"
                    rows={3}
                  ></textarea>
                </div>
                <select
                  className="form-select fs-6"
                  aria-label="Select Director"
                >
                  {role && role.toLowerCase() === "director" ? (
                    <>
                      <option value="" selected>
                        Select Deputy Director
                      </option>
                      <option value={officers[2]?.id}>
                        {officers[2]?.fullName}
                      </option>
                      <option value={officers[3]?.id}>
                        {officers[3]?.fullName}
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="" selected>
                        Select Director
                      </option>
                      <option value={officers[0]?.id}>
                        {officers[0]?.fullName}
                      </option>
                      <option value={officers[1]?.id}>
                        {officers[1]?.fullName}
                      </option>
                    </>
                  )}
                </select>
              </div>
              <div className="row d-flex justify-content-end m-0">
                {userId && role && role.toLowerCase() === "deputy director" && (
                  <div className="col-auto">
                    <Button
                      onClick={() =>
                        handleMarkedReport({
                          id: 0,
                          visitId: data.visitId,
                          projectId: data.projectId,
                          submittedFrom: userId,
                          submittedTo: selectedOfficerId,
                          remarks: remarks,
                          reportPath: data.reportPath,
                          status: 1,
                          sDate: new Date().toISOString(),
                          reportType: data.reportType,
                        })
                      }
                      className="btn rounded-pill fs18px fw-normal px-3"
                      style={{ background: "rgba(0, 57, 206,.05)" }}
                    >
                      Approved & Mark To
                    </Button>
                  </div>
                )}
                {userId && role && role.toLowerCase() === "director" && (
                  <div className="col-auto">
                    <Button
                      onClick={() =>
                        handleMarkedReport({
                          id: 0,
                          visitId: data.visitId,
                          projectId: data.projectId,
                          submittedFrom: userId,
                          submittedTo: selectedOfficerId,
                          remarks: remarks,
                          reportPath: data.reportPath,
                          status: 1,
                          sDate: new Date().toISOString(),
                          reportType: data.reportType,
                        })
                      }
                      className="btn rounded-pill fs18px fw-normal"
                      style={{ background: "rgba(0, 57, 206,.05)" }}
                    >
                      Approved
                    </Button>
                  </div>
                )}
                <div className="col-auto pe-0">
                  <Button
                    className="btn rounded-pill fs18px fw-normal px-3"
                    style={{
                      background: "rgba(0, 57, 206,.05)",
                      color: "#0039CE",
                    }}
                  >
                    Referback
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportNoting;
