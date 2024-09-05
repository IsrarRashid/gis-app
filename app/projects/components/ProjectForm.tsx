import Modal from "react-bootstrap/Modal";
import plus from "../../../public/icons/plus.svg";
import minus from "../../../public/icons/minus.svg";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import more from "../../../public/icons/more.svg";
import { projectAPI, sectorAPI } from "@/app/APIs";
import { ToastContainer, toast } from "react-toastify";

interface Form {
  sectorId: number;
  name: string;
  address: string;
  city: string;
  locationCoordinates: string;
  status: string;
  groups: string;
}

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}

interface PropsData {
  id: number;
  parentId: number;
  name: string;
}

const ProjectForm = ({ api, method, id, setRefresh, refresh }: Props) => {
  const [projectsData, setProjectsData] = useState<PropsData[]>([]);
  const [sectorsData, setsectorsData] = useState<PropsData[]>([]);
  const [formData, setFormData] = useState<Form>({
    sectorId: 0,
    name: "",
    address: "",
    city: "",
    locationCoordinates: "",
    status: "",
    groups: "",
  });
  const [show, setShow] = useState(false);

  // error messages
  const created = "Created Successfully";
  const updated = "Updated Successfully";
  const errorMessage = "something Bad Happend";
  const nameError = "Project Name is missing";
  const addressError = "Address is missing";
  const cityError = "City is missing";
  const locationCoordinatesError = "location coordinates is missing";
  const sectorNameError = "Sector Name is missing";
  const groupsError = "Groups is missing";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const response = await axios.get(projectAPI, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setProjectsData(response.data.data);
        }
        console.log("projectsData Data:", projectsData);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    loadItems();
  }, [refresh]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const response = await axios.get(sectorAPI, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setsectorsData(response.data.data);
        }
        console.log("sectorsData:", sectorsData);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    loadItems();
  }, [refresh]);

  const handleClose = () => setShow(false);
  const handleShow = async () => {
    setShow(true);

    if (method === "PUT") {
      try {
        // send a request to the server to add the product
        const token = Cookies.get("token");
        if (token) {
          const response = await axios({
            method: "GET",
            url: `${api}/${id}`,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const itemData = response.data.data;
          setFormData({
            sectorId: itemData.sectorId,
            name: itemData.name,
            address: itemData.address,
            city: itemData.city,
            locationCoordinates: itemData.locationCoordinates,
            status: itemData.status,
            groups: itemData.groups,
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setFormData({
        sectorId: 0,
        name: "",
        address: "",
        city: "",
        locationCoordinates: "",
        status: "",
        groups: "",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    switch (true) {
      case !formData.name:
        notifyError(nameError);
        break;

      case !formData.address:
        notifyError(addressError);
        break;

      case !formData.city:
        notifyError(cityError);
        break;

      case !formData.locationCoordinates:
        notifyError(locationCoordinatesError);
        break;

      case !formData.groups:
        notifyError(groupsError);
        break;

      default:
        try {
          // send a POST request to the server to add the product
          const token = Cookies.get("token");

          if (token) {
            if (method === "POST") {
              const response = await axios({
                method: method,
                url: api,
                data: formData,
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
              notifyCreate(created);
              setFormData({
                sectorId: 0,
                name: "",
                address: "",
                city: "",
                locationCoordinates: "",
                status: "",
                groups: "",
              });

              console.log("response", response);
              setRefresh((prev) => !prev);
            } else if (method === "PUT") {
              const response = await axios({
                method: method,
                data: formData,
                url: `${api}/${id}`,
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
              console.log("response", response);
              notifyCreate(updated);
            } else {
              console.log("api is wrong");
            }
          }
          // handle the response and perform any necessary actions
          console.log("data", formData);
        } catch (err) {
          console.log((err as AxiosError).message);
          notifyError((err as AxiosError).message);
        }
    }
  };

  return (
    <>
      {method === "POST" ? (
        <button
          type="button"
          className="btn btn-sm text-white bg-color-sea-green"
          onClick={handleShow}
        >
          + Add Project
        </button>
      ) : (
        <button
          className="btn btn-sm rounded-pill"
          style={{ background: "#fff" }}
          onClick={handleShow}
        >
          <Image src={more} alt="more" />
        </button>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          <div
            className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
            style={{
              backgroundImage: "linear-gradient(to left, #969696 ,#d9d9d9)",
              borderRadius: "20px",
            }}
          >
            <div className="row flex-column justify-content-center mb-4">
              <div className="col-lg-12">
                {method === "POST" ? (
                  <p className="text-center text-white mt-4 fw-bold">
                    <span>ADD PROJECT</span>
                  </p>
                ) : (
                  <p className="text-center text-white mt-4 fw-bold">
                    <span>UPDATE PROJECT</span>
                  </p>
                )}
              </div>
              <form className="ps-5 pe-5" onSubmit={handleSubmit}>
                <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
                  <label htmlFor="name" className="form-label text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Project Name"
                  />
                </div>
                <div className="col mb-3">
                  <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
                    <label htmlFor="address" className="form-label text-white">
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter Address"
                    />
                  </div>
                  <div className="row d-flex justify-content-between">
                    <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                      <label htmlFor="status" className="form-label text-white">
                        Status
                      </label>
                      <select
                        className="form-select form-select-sm"
                        aria-label="Default select example"
                        name="status"
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Not Confirmed">Not Confirmed</option>
                        <option value="Cancel">Cancel</option>
                        <option value="Complete">Complete</option>
                      </select>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                      <label
                        htmlFor="parentId"
                        className="form-label text-white"
                      >
                        Sector Id
                      </label>
                      <select
                        className="form-select form-select-sm"
                        aria-label="Default select example"
                        name="parentId"
                        onChange={handleChange}
                      >
                        {sectorsData.length > 0 ? (
                          sectorsData?.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>Loading...</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row d-flex justify-content-between">
                  <div className="col-lg-6 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="city" className="form-label text-white">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter City Name"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="groups" className="form-label text-white">
                      Groups
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="groups"
                      name="groups"
                      value={formData.groups}
                      onChange={handleChange}
                      placeholder="Enter Groups"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
                  <label
                    htmlFor="locationCoordinates"
                    className="form-label text-white"
                  >
                    Location Coordinates
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="locationCoordinates"
                    name="locationCoordinates"
                    value={formData.locationCoordinates}
                    onChange={handleChange}
                    placeholder="Enter Location Coordinates"
                  />
                </div>
                <div className="col-lg-8 col-md-8 col-sm-6 mx-auto">
                  <button
                    className="btn bg-color-sea-green text-white w-100"
                    type="submit"
                  >
                    Done
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <ToastContainer />
      </Modal>
    </>
  );
};

export default ProjectForm;
