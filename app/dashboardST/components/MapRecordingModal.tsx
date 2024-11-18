import Button from "@/app/components/Button";
import Menu from "@/app/components/Menu";
import Image from "next/image";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import apiClient from "@/app/services/api-client";
import {
  getUserProjectsAPI,
  mainDashboardAPI,
  staffTrackingAPI,
  visitAPI,
} from "@/app/APIs";
import { Modal } from "react-bootstrap";
import {
  getCurrentDate,
  StaffTracking,
  TrackingRequestData,
} from "./DashboardST";
import { Project } from "@/app/hooks/useProjects";
import Users from "@/app/users/components/Users";
import useAuthentication from "@/app/hooks/useAuthentication";

interface ProjectVisit {
  visitId: number;
  visitName: string;
}

interface Props {
  setMapStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setTrackingRequestBody: Dispatch<SetStateAction<TrackingRequestData>>;
  trackingRequestBody: TrackingRequestData;
}

const getFormattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MapRecordingModal = ({
  setMapStatus,
  setTrackingRequestBody,
  trackingRequestBody,
}: Props) => {
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  const handleShow = async () => {
    setShow(true);
  };
  const [data, setData] = useState<StaffTracking[]>();
  const [userProjects, setUserProjects] = useState<Project[]>([]); // Store the original data
  const [userVisits, setUserVisits] = useState<ProjectVisit[]>([]); // Store the original data
  const [userDate, setUserDate] = useState<Date | null>(); // Store the original data
  const modalId = "mapRecordingModal";
  const [isVisitSelected, setVisitSelected] = useState<boolean>(false); // Store the original data
  const [isDateSelected, setDateSelected] = useState<boolean>(false); // Store the original data

  const [refresh, setRefresh] = useState<boolean>(false); // Store the original data
  const { data: users } = useAuthentication({ refresh });

  const getStaffWithCoordinates = async (
    trackingRequestBody: TrackingRequestData
  ) => {
    try {
      const response = await apiClient.post(
        staffTrackingAPI,
        trackingRequestBody
      );
      if (response.data.data) {
        setData(response.data.data);
      } else {
        console.log("Something bad happend");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    getStaffWithCoordinates({ userId: 0, visitId: 0, date: getCurrentDate() });
  }, []);

  const handleUserSubmit = async (id: number) => {
    try {
      const response = await apiClient.get(
        `${getUserProjectsAPI}?userId=${id}`
      );
      console.log("Response:", response);
      setUserProjects(response.data.data);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const handleProjectSubmit = async (id: number) => {
    try {
      const response = await apiClient.get(
        `${visitAPI}/GetVisitsByProjectId?ProjectId=${id}`
      );
      console.log("Response:", response);
      setUserVisits(response.data.data);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  //   const handleSubmit = async (districtId: number, api: string) => {
  //     console.log(api);
  //     try {
  //       const response = await apiClient.get(`${api}?districtId=${districtId}`);
  //       if (response.data.data.length > 0) {
  //         setProjectsData(response.data.data.reverse());
  //       } else {
  //         setProjectsData([]);
  //       }
  //     } catch (err) {
  //       console.error("Submission error:", err);
  //     }
  //   };

  return (
    <>
      <Button
        className="btn btn-success shadow-none ps-2 pe-2 fw-bold letterSpacing1px"
        type="button"
        onClick={() => {
          handleShow();
        }}
        data-bs-target={`#${modalId}`}
      >
        Recording
      </Button>

      <Modal
        size="lg"
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
          {data && (
            <div
              className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
              style={{
                borderRadius: "20px",
                background: "#fff",
              }}
            >
              <h3 className="fw-bold text-center">Recordings</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (trackingRequestBody) {
                    getStaffWithCoordinates(trackingRequestBody);
                  }
                  setMapStatus(true);
                }}
              >
                <div className="col mb-3 text-start">
                  <label htmlFor="users" className="form-label">
                    Users
                  </label>
                  <select
                    className="form-select form-select-sm"
                    aria-label="users"
                    name="users"
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue === "") {
                        setUserProjects([]); // Set null if "Select" option is chosen
                        setTrackingRequestBody((prev) => ({
                          ...prev,
                          userId: 0,
                        }));
                      } else {
                        const selectedId = parseInt(selectedValue, 10);
                        handleUserSubmit(selectedId); // Call handleUserSubmit with the selected userId
                        setTrackingRequestBody((prev) => ({
                          ...prev,
                          userId: selectedId,
                        }));
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {users.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.userName}
                        {d.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col mb-3 text-start">
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    placeholder="Select Date"
                    disabled={isVisitSelected}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue === "") {
                        setUserDate(null); // Set null if "Select" option is chosen
                        setTrackingRequestBody((prev) => ({
                          ...prev,
                          date: null,
                        }));
                        setDateSelected(false);
                      } else {
                        const newDate = new Date(selectedValue);
                        setTrackingRequestBody((prev) => ({
                          ...prev,
                          date: getFormattedDate(newDate),
                          visitId: 0,
                        }));
                        setDateSelected(true);
                      }
                    }}
                  />
                </div>

                <div className="col mb-3 text-start">
                  <label htmlFor="projects" className="form-label">
                    Projects
                  </label>
                  <select
                    className="form-select form-select-sm"
                    aria-label="projects"
                    name="projects"
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue === "") {
                        setUserVisits([]); // Set null if "Select" option is chosen
                      } else {
                        const selectedId = parseInt(selectedValue, 10);
                        handleProjectSubmit(selectedId); // Call handleUserSubmit with the selected userId
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {userProjects.length > 0 &&
                      userProjects.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="col mb-3 text-start">
                  <label htmlFor="visits" className="form-label">
                    Visits
                  </label>
                  <select
                    className="form-select form-select-sm"
                    aria-label="visits"
                    name="visits"
                    disabled={isDateSelected}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue === "") {
                        setTrackingRequestBody((prev) => ({
                          ...prev,
                          visitId: 0,
                          date: null,
                        }));
                        setVisitSelected(false);
                      } else {
                        setTrackingRequestBody((prev) => ({
                          ...prev,
                          visitId: parseInt(selectedValue),
                          date: null,
                        }));
                        setVisitSelected(true);
                      }
                    }}
                  >
                    <option value="">Select</option>
                    {userVisits.length > 0 &&
                      userVisits.map((d) => (
                        <option key={d.visitId} value={d.visitId}>
                          {d.visitName}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="row d-flex">
                  <div className="col-lg-6 col-md-6 col-sm-12 text-end">
                    <Button
                      className="btn w-50 fs-5 text-white"
                      type="submit"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #0C8CE9 , #13629B)",
                        border: "0px",
                      }}
                    >
                      Filter
                    </Button>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                    <Button
                      className="btn w-50 fs-5"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      style={{
                        border: "2px solid #0C8CE9",
                        color: "#0C8CE9",
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MapRecordingModal;
