import Button from "@/app/components/Button";
import Menu from "@/app/components/Menu";
import Image from "next/image";
import ProjectsTable from "./ProjectsTable";
import { ProjectsList } from "./Dashboard";
import { Dispatch, SetStateAction, useState } from "react";
import MenuProjectsTable from "./MenuProjectsTable";
import apiClient from "@/app/services/api-client";
import { mainDashboardAPI } from "@/app/APIs";
import { Modal } from "react-bootstrap";

interface Props {
  background: string;
  outline?: string;
  icon: string;
  value: number;
  label: string;
  showTides: boolean;
  tideOneImage?: string;
  tideTwoImage?: string;
  districtId?: number;
  api: string;
  modalId: string;
}

export interface MenuProject {
  id: number;
  gSno: string;
  projectName: string;
  districtName: string;
  sectorName: string;
  userName: string;
  reportCompletion: number;
  visitStartDate: string;
  visitEndDate: string;
  completedDate: string;
}

const MenuModal = ({
  background,
  outline,
  icon,
  value,
  label,
  showTides,
  tideOneImage,
  tideTwoImage,
  districtId = 0,
  api,
  modalId,
}: Props) => {
  const [projectsData, setProjectsData] = useState<MenuProject[]>();
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  const handleShow = async () => {
    setShow(true);
  };

  const handleSubmit = async (districtId: number, api: string) => {
    console.log(api);
    try {
      const response = await apiClient.get(`${api}?districtId=${districtId}`);
      if (response.data.data.length > 0) {
        setProjectsData(response.data.data.reverse());
      } else {
        setProjectsData([]);
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          handleSubmit(districtId, api);
          handleShow();
        }}
        className="col shadow-none btn p-0"
        data-bs-target={`#${modalId}`}
      >
        <Menu
          background={background}
          outline={outline}
          icon={icon}
          value={value}
          label={label}
          showTides={showTides}
          tideOneImage={tideOneImage}
          tideTwoImage={tideTwoImage}
        />
      </Button>

      <Modal
        size="xl"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="custom-modal"
        id={modalId}
      >
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          <div
            className="container-fluid border border-white p-3"
            style={{
              borderRadius: "20px",
              background: "#CFE6F8",
            }}
          >
            <div className="col">
              <Button className="btn p-0" onClick={handleClose}>
                <Image
                  src="/icons/cross.svg"
                  alt="cross"
                  width={30}
                  height={30}
                />
              </Button>
            </div>
            {projectsData && (
              <MenuProjectsTable
                projectsData={projectsData}
                setProjectsData={setProjectsData}
                handleClose={handleClose}
                label={label}
              />
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MenuModal;
