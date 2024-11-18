import Button from "@/app/components/Button";
import Menu from "@/app/components/Menu";
import Image from "next/image";
import ProjectsTable from "../ProjectsTable";
import { ProjectsList } from "../Dashboard";
import { Dispatch, SetStateAction, useState } from "react";
import MenuProjectsTable from "../MenuProjectsTable";
import apiClient from "@/app/services/api-client";
import { mainDashboardAPI, projectAPI } from "@/app/APIs";
import { Modal } from "react-bootstrap";
import { Project } from "@/app/hooks/useProjects";
import Main from "./components/Main";

const ProjectReportOverviewModal = () => {
  const [projectsData, setProjectsData] = useState<Project | null>(null);
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  const handleShow = async () => {
    setShow(true);
  };

  const handleSubmit = async (id: number) => {
    try {
      const response = await apiClient.get(`${projectAPI}/${id}`);
      setProjectsData(response.data.data);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          // handleSubmit(964);
          handleShow();
        }}
        className="col shadow-none btn p-0"
        data-bs-target={`#01`}
      >
        Report
      </Button>

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="custom-modal"
        id="01"
      >
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          <div
            className="container-fluid bg-white py-3 px-4"
            style={{
              borderRadius: "12px",
            }}
          >
            <div className="row d-flex mb-2">
              <div className="col-1">
                <img
                  src="/icons/briefcase.svg"
                  alt="mainPage"
                  className="img-fluid"
                  style={{ width: "25px", height: "25px" }}
                />
              </div>
              <div className="col ps-0 fw-bold">
                Rehabilitation of Multan Dunyapur road from Allah Wasaya Chowk
                to District Boundary Multan
              </div>
            </div>
            <div className="accordion" id="accordionMain">
              <div className="accordion-item border-0">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="row d-flex justify-content-between accordion-button py-2 px-3 m-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    <div className="col-lg-1 col-md-1 col-1 p-0">
                      <img
                        src="/icons/mainPage.svg"
                        alt="mainPage"
                        className="img-fluid"
                      />
                    </div>
                    <div className="col p-0">
                      <div className="row d-flex flex-column">
                        <p className="m-0 fs14px pe-0">Main</p>
                        <p
                          className="m-0 fs12px pe-0"
                          style={{ color: "#83858F" }}
                        >
                          Your personal main presentation
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-1 col-md-2 col-2 ps-0">75%</div>
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionMain"
                >
                  <div className="accordion-body">
                    <Main />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProjectReportOverviewModal;
