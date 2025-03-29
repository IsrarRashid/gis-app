import { visitAPI } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal";
import Loader from "@/app/components/Loader";
import apiClient from "@/app/services/api-client";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import ProjectsTable, { ProjectsList } from "./ProjectsTable/ProjectsTable";
import visitPlan from "@/public/icons/visitPlan.svg";
import { addDayToFormattedDate, getFormattedDate } from "@/app/utils";

interface VisitsPlan {
  nameOfVisit: string;
  totalOfVisits: number;
  totalOfDrivers: number;
  totalOfCars: number;
  pdfOfVisit: string;
  detailOfEachVisit: [
    {
      officerName: string;
      designation: string;
      fromDate: string;
      toDate: string;
      totalVisits: number;
      completeVisits: number;
      pendingVisits: number;
      onTimeSubmitted: number;
      lateSubmitted: number;
      issuedReport: number;
    }
  ];
}

interface Props {
  getProjectsList: (status: string) => Promise<void>;
  projectsData: ProjectsList[];
  setProjectsData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
}

const VisitsPlan = ({
  getProjectsList,
  projectsData,
  setProjectsData,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<VisitsPlan[]>();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`${visitAPI}/GetVisitPlan`);
      setData(response.data.data);
      console.log("visits plan data", response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Submission error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  // Filter and map keys
  const filteredKeys =
    projectsData.length > 0 &&
    Object.keys(projectsData[0])
      .filter((key) =>
        [
          "id",
          "projectName",
          "sectorName",
          "districtName",
          "userName",
          "reportCompletion",
          "visitStartDate",
          "completedDate",
          "deadline",
          "fileGenrated",
        ].includes(key)
      )
      .map((key) => key as keyof ProjectsList);

  return (
    <>
      <CustomModal
        HeaderTopPos={0}
        size="xl"
        modalId="visitsPlan"
        button={
          <Button
            className="row d-flex flex-nowrap m-0 justify-content-center btn w-100 fw-normal fs14px"
            style={{
              borderRadius: "8px",
              background: "#C6F1DF",
            }}
          >
            <div className="col-auto pe-1 my-auto">
              <Image src={visitPlan} alt="visitPlan" width={24} height={24} />
            </div>
            <div className="col-auto p-0">
              Visits
              <br />
              Plan
            </div>
          </Button>
        }
        body={
          <div
            className="container-fluid border border-white px-4 py-3"
            style={{
              borderRadius: "20px",
              background: "#fff",
              height: "700px",
              overflow: "scroll",
            }}
          >
            <p className="mb-3 fw-bold">
              <Image
                src="/icons/briefcase.svg"
                alt="briefcase"
                width={24}
                height={24}
              />{" "}
              Reports of All the Projects Listed
            </p>
            <Accordion>
              {data &&
                data.map((d, i) => (
                  <Accordion.Item key={i} eventKey={`${i}`}>
                    <Accordion.Header>
                      <>
                        {d.pdfOfVisit && (
                          <Link
                            href={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.pdfOfVisit}`}
                            target="_blank"
                            className="text-decoration-none text-white"
                          >
                            <img
                              src="/images/tourPlans2.png"
                              alt="pdfViewable"
                              className="img-fluid shadow-sm me-2"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "10px",
                                border: "1px solid #E8E8E8",
                              }}
                            />
                          </Link>
                        )}
                        <div className="col m-auto">
                          <p className="mb-1 fs14px fw-bold">{d.nameOfVisit}</p>
                          <p
                            className="mb-1 fs12px fw-normal"
                            style={{ color: "#83858F" }}
                          >
                            {d.totalOfVisits} Projects
                          </p>
                        </div>
                      </>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div
                        className="container-fluid border border-white p-3 bg-white"
                        style={{
                          borderRadius: "20px",
                          height: "400px",
                          overflow: "scroll",
                        }}
                      >
                        <table className="table table-hover text-center">
                          <thead>
                            <tr className="fs14px">
                              <th className="border-0">&nbsp;</th>
                              <th
                                colSpan={3}
                                className="text-center border-0 fw-normal"
                              >
                                <div className="border">&nbsp;</div>
                                <div style={{ marginTop: "-34px" }}>
                                  <span className="bg-white fw-bold">
                                    Visits
                                  </span>
                                </div>
                              </th>
                              <th
                                colSpan={2}
                                className="text-center border-0 fw-normal"
                              >
                                <div className="border">&nbsp;</div>
                                <div style={{ marginTop: "-34px" }}>
                                  <span className="bg-white fw-bold">
                                    Reports Submitted
                                  </span>
                                </div>
                              </th>
                              <th className="border-0">&nbsp;</th>
                            </tr>
                            <tr>
                              <td className="bg-color-sea-blue rounded-pill rounded-end p-0 border-0 text-center">
                                <div
                                  style={{ background: "#0468C8" }}
                                  className="p-0 rounded-pill text-white py-2 fs18px fw-bold text-center"
                                >
                                  Name
                                </div>
                              </td>
                              <td className="bg-color-sea-blue border-0 text-white text-center fs18px fw-bold">
                                Total
                              </td>
                              <td className="bg-color-sea-blue border-0 text-white text-center fs18px fw-bold">
                                Completed
                              </td>
                              <td className="bg-color-sea-blue border-0 text-white text-center fs18px fw-bold">
                                Scheduled
                              </td>
                              <td className="bg-color-sea-blue border-0 text-white text-center fs18px fw-bold text-nowrap">
                                On-Time
                              </td>
                              <td className="bg-color-sea-blue border-0 text-white text-center fs18px fw-bold">
                                Late
                              </td>
                              <td className="bg-color-sea-blue border-0 text-white rounded-pill rounded-start text-center fs18px fw-bold">
                                Reports Issued
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            {d.detailOfEachVisit.map((visit, j) => (
                              <tr key={j}>
                                <td
                                  style={{
                                    // background: "rgba(241, 241, 241, 0.88)",
                                    color: "#414651",
                                  }}
                                  className="rounded-pill rounded-end border-0 fs14px fw-bold px-0 py-1"
                                >
                                  <div
                                    className="rounded-pill rounded-end "
                                    style={{
                                      background: "rgba(241, 241, 241, 0.88)",
                                    }}
                                  >
                                    <CustomModal
                                      HeaderTopPos={0}
                                      HeaderRightPos={10}
                                      isFullscreen={true}
                                      size="xl"
                                      modalId={`${j}"Projects"`}
                                      button={
                                        <Button
                                          className="btn p-0 pe-1 shadow-none w-100"
                                          onClick={() =>
                                            getProjectsList("BeingMonitored")
                                          }
                                        >
                                          {visit.officerName}
                                          <br />
                                          {visit.designation}
                                          <br />
                                          From:{" "}
                                          {addDayToFormattedDate(
                                            getFormattedDate(
                                              new Date(visit.fromDate),
                                              "short"
                                            )!
                                          )}
                                          To:
                                          {addDayToFormattedDate(
                                            getFormattedDate(
                                              new Date(visit.toDate),
                                              "short"
                                            )!
                                          )}
                                        </Button>
                                      }
                                      body={
                                        <>
                                          <div
                                            className="container-fluid border border-white p-3"
                                            style={{
                                              borderRadius: "20px",
                                              background: "#CFE6F8",
                                              height: "100%",
                                              overflow: "scroll",
                                            }}
                                          >
                                            {projectsData && filteredKeys ? (
                                              <ProjectsTable
                                                label="Being Monitored Projects"
                                                projectsData={projectsData}
                                                setProjectsData={
                                                  setProjectsData
                                                }
                                                keys={filteredKeys}
                                                searchTermDefault={
                                                  visit.officerName
                                                }
                                                // defaultFilters={{
                                                //   districtName: "",
                                                //   sectorName: "",
                                                //   userName: visit.officerName,
                                                //   startDate:
                                                //     d.nameOfVisit.split(" ")[2], // Start date for  range
                                                //   endDate:
                                                //     d.nameOfVisit.split(" ")[4], // End date for  range
                                                //   reportSubmitted: "",
                                                // }}
                                              />
                                            ) : (
                                              <Loader />
                                            )}
                                          </div>
                                        </>
                                      }
                                    />
                                  </div>
                                </td>
                                <td
                                  style={{
                                    // background: "rgba(241, 241, 241, 0.88)",
                                    color: "#414651",
                                  }}
                                  className="border-0 text-center fs14px fw-normal px-0 py-1"
                                >
                                  <div
                                    style={{
                                      background: "rgba(241, 241, 241, 0.88)",
                                      padding: "10px 0px 19px 0px",
                                    }}
                                  >
                                    {visit.totalVisits}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    // background: "rgba(241, 241, 241, 0.88)",
                                    color: "#414651",
                                  }}
                                  className="border-0 text-center fs14px fw-normal px-0 py-1"
                                >
                                  <div
                                    style={{
                                      background: "rgba(241, 241, 241, 0.88)",
                                      padding: "10px 0px 19px 0px",
                                    }}
                                  >
                                    {visit.completeVisits}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    // background: "rgba(241, 241, 241, 0.88)",
                                    color: "#414651",
                                  }}
                                  className="border-0 text-center fs14px fw-normal px-0 py-1"
                                >
                                  <div
                                    style={{
                                      background: "rgba(241, 241, 241, 0.88)",
                                      padding: "10px 0px 19px 0px",
                                    }}
                                  >
                                    {visit.pendingVisits}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    // background: "rgba(241, 241, 241, 0.88)",
                                    color: "#414651",
                                  }}
                                  className="border-0 text-center fs14px fw-normal px-0 py-1"
                                >
                                  <div
                                    style={{
                                      background: "rgba(241, 241, 241, 0.88)",
                                      padding: "10px 0px 19px 0px",
                                    }}
                                  >
                                    {visit.onTimeSubmitted}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    // background: "rgba(241, 241, 241, 0.88)",
                                    color: "#414651",
                                  }}
                                  className="border-0 text-center fs14px fw-normal px-0 py-1"
                                >
                                  <div
                                    style={{
                                      background: "rgba(241, 241, 241, 0.88)",
                                      padding: "10px 0px 19px 0px",
                                    }}
                                  >
                                    {visit.lateSubmitted}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    // background: "rgba(241, 241, 241, 0.88)",
                                    color: "#414651",
                                  }}
                                  className="border-0 fs14px fw-bold px-0 py-1"
                                >
                                  <div
                                    style={{
                                      background: "rgba(241, 241, 241, 0.88)",
                                      padding: "10px 0px 19px 0px",
                                      borderTopRightRadius: "20px",
                                      borderBottomRightRadius: "20px",
                                    }}
                                  >
                                    {visit.issuedReport}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
            </Accordion>
          </div>
        }
      />
    </>
  );
};

export default VisitsPlan;
