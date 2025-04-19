import { projectAPI } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal";
import ProgressBar from "@/app/components/ProgressBar";
import {
  Attributes,
  Groups,
} from "@/app/project-details-dashboard/components/ProjectDetailsDashboard";
import apiClient from "@/app/services/api-client";
import book from "@/public/icons/book.svg";
import dotsL from "@/public/icons/dotsL.svg";
import drawer from "@/public/icons/drawer.svg";
import levelsUp from "@/public/icons/levelsUp.svg";
import mainPage from "@/public/icons/mainPage.svg";
import money from "@/public/icons/money.svg";
import star from "@/public/icons/star.svg";
import fileAttach from "@/public/icons/fileAttach.svg";
import starBalloon from "@/public/icons/starBalloon.svg";
import warningIcon2 from "@/public/icons/warningIcon2.svg";
import waveUp2 from "@/public/icons/waveUp2.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import DesignAndScope from "./components/DesignAndScope";
import EarnedValueAnalysis from "./components/EarnedValueAnalysis";
import FinancialAnalysis from "./components/FinancialAnalysis";
import Main from "./components/Main";
import MajorDeliverable from "./components/MajorDeliverable";
import MonitoringRatingIndex from "./components/MonitoringRatingIndex";
import ObservationsAndRecommendations from "./components/ObservationsAndRecommendations";
import ProgressAnalysis from "./components/ProgressAnalysis";
import ProjectProfile from "./components/ProjectProfile";

interface Props {
  value: number;
  id: number;
  visitId: number;
}

export interface Project {
  id: number;
  superGroupID: number;
  smdpProjectID: number;
  name: string;
  sectorId: number;
  address: string;
  city: string;
  locationCoordinates: string;
  status: string;
  sectorName: string;
  groups: Groups[];
  attributes: Attributes[];
  evaluationFormula: string;
  evaluationFormulaWeightage: number;
  remarks: string;
  weightage: number;
  readOnly: number;
  sortId: number;
  attributeCode: string;
  smdpIdentifier: string;
}

const ProjectReportOverviewModal = ({ value, id, visitId }: Props) => {
  const [projectsData, setProjectsData] = useState<Project | null>(null);
  const [totalValue, setTotalValue] = useState<number>();
  const [gainedValue, setGainedValue] = useState<number>();
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  const handleShow = async () => {
    setShow(true);
  };

  const handleSubmit = async (id: number, visitId: number) => {
    try {
      const response = await apiClient.get(
        `${projectAPI}/${id}?visitId=${visitId}`
      );
      setProjectsData(response.data.data);
      console.log("reports data", response.data.data);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const icons = [
    {
      icon: mainPage,
    },
    {
      icon: book,
    },
    {
      icon: dotsL,
    },
    {
      icon: drawer,
    },
    {
      icon: levelsUp,
    },
    {
      icon: money,
    },
    {
      icon: star,
    },
    {
      icon: starBalloon,
    },
    {
      icon: warningIcon2,
    },
    {
      icon: waveUp2,
    },
    {
      icon: fileAttach,
    },
  ];

  const calculatePercentage = (attributes: any, groups: any) => {
    const totalValue =
      attributes.length > 0
        ? attributes.length
        : groups.reduce(
            (total: any, group: any) => total + (group.attributes?.length || 0),
            0
          ) || 0;

    // setTotalValue(totalValue);
    const gainedValue =
      attributes.length > 0
        ? attributes.filter(
            (attribute: any) =>
              attribute.values.length > 0 && attribute.values[0].value !== null
          ).length
        : groups.reduce((gained: any, group: any) => {
            const groupGained = group.attributes?.filter(
              (attribute: any) =>
                attribute.values.length > 0 &&
                attribute.values[0]?.value !== null
            ).length;
            return gained + (groupGained || 0);
          }, 0) || 0;

    // setGainedValue(gainedValue);
    return gainedValue && totalValue ? (gainedValue / totalValue) * 100 : 0;
    console.log(
      "gained percentage:",
      gainedValue && totalValue ? (gainedValue / totalValue) * 100 : 0,
      "gainedValue:",
      gainedValue,
      "totalValue:",
      totalValue
    );
  };

  useEffect(() => {}, [projectsData]);

  return (
    <>
      <CustomModal
        showCloseButton={false}
        button={
          <Button
            type="button"
            onClick={() => {
              handleSubmit(id, visitId);
            }}
            className="col w-100 shadow-none btn p-0"
          >
            <div className="row d-flex m-0">
              <ProgressBar value={Math.round(value)} />
              <div className="col-auto p-0 color-dark-blue fw-bold fs13px">
                {Math.round(value)}%
              </div>
            </div>
          </Button>
        }
        body={
          <div style={{ width: "100%", height: "627px", overflowY: "scroll" }}>
            <Accordion>
              {projectsData &&
                projectsData.groups.map((group, index) => {
                  return (
                    <Accordion.Item
                      key={group.id}
                      eventKey={group.name}
                      className="border-top-0 border-end-0 border-start-0"
                    >
                      <Accordion.Header>
                        <div className="col-auto pe-1">
                          <Image
                            src={icons[index]?.icon}
                            alt="mainPage"
                            className="img-fluid"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="col">
                          <div className="row d-flex flex-column m-0">
                            <p className="m-0 fs14px ps-0 flex-wrap">
                              {group.name}
                            </p>
                            <p
                              className="m-0 fs12px ps-0 flex-wrap"
                              style={{ color: "#83858F" }}
                            >
                              {group.description && group.description}
                            </p>
                          </div>
                        </div>
                        <div className="col fw-bold fs15px pe-3">
                          <div className="row d-flex m-0">
                            <ProgressBar
                              value={Math.round(
                                calculatePercentage(
                                  group.attributes,
                                  group.group
                                )
                              )}
                            />
                            <div className="col-1 p-0 pe-4 text-dark">
                              {Math.round(
                                calculatePercentage(
                                  group.attributes,
                                  group.group
                                )
                              )}
                              %
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-lg-1 col-md-2 col-2 ps-0">
                      {Math.round(value)}%
                    </div> */}
                      </Accordion.Header>
                      <Accordion.Body>
                        {group.name.toLowerCase().includes("main") ? (
                          <Main group={group} />
                        ) : group.name
                            .toLowerCase()
                            .includes("project profile") ? (
                          <ProjectProfile group={group} />
                        ) : group.name
                            .toLowerCase()
                            .includes("design & scope") ? (
                          <DesignAndScope group={group} />
                        ) : group.name
                            .toLowerCase()
                            .includes("major deliverable") ? (
                          <MajorDeliverable group={group} />
                        ) : group.name
                            .toLowerCase()
                            .includes("progress analysis") ? (
                          <ProgressAnalysis group={group} />
                        ) : group.name
                            .toLowerCase()
                            .includes("earned value analysis") ? (
                          <EarnedValueAnalysis group={group} />
                        ) : group.name
                            .toLowerCase()
                            .includes("financial analysis") ? (
                          <FinancialAnalysis group={group} />
                        ) : group.name
                            .toLowerCase()
                            .includes("monitoring rating index") ? (
                          <MonitoringRatingIndex group={group} />
                        ) : group.name.toLowerCase().includes("observation") ? (
                          <ObservationsAndRecommendations group={group} />
                        ) : (
                          <div>No Data Available</div>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
            </Accordion>
          </div>
        }
        modalId={"projectReport"}
      />
    </>
  );
};

export default ProjectReportOverviewModal;
