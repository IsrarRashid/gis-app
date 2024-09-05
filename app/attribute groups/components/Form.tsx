import Modal from "react-bootstrap/Modal";
import plus from "../../../public/icons/plus.svg";
import minus from "../../../public/icons/minus.svg";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import more from "../../../public/icons/more.svg";
import { attributeGroupsAPI } from "@/app/APIs";
import { ToastContainer, toast } from "react-toastify";

interface Form {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  parentId: number;
  sortId: number;
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

const Form = ({ api, method, id, setRefresh, refresh }: Props) => {
  const [data, setData] = useState<PropsData[]>([]);
  const [formData, setFormData] = useState<Form>({
    name: "",
    parentId: 0,
    description: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sortId: 0,
  });
  const [show, setShow] = useState(false);

  // error messages
  const created = "Created Successfully";
  const updated = "Updated Successfully";
  const errorMessage = "something Bad Happend";
  const nameError = "Name is missing";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const response = await axios.get(attributeGroupsAPI, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setData(response.data.data);
        }
        console.log("api Data:", data);
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
        // send a POST request to the server to add the product
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
            parentId: itemData.parentId,
            name: itemData.name,
            description: itemData.description,
            sortId: itemData.sortId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.log(error);
      }
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

    try {
      // send a POST request to the server to add the product
      const token = Cookies.get("token");

      switch (true) {
        case !formData.name:
          notifyError(nameError);
          break;

        default:
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
              setFormData({
                name: "",
                parentId: 0,
                description: "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                sortId: 0,
              });
              notifyCreate(created);
              console.log("response", response);
              setRefresh((prev) => !prev);
            } else if (method === "PUT") {
              const response = await axios({
                method: method,
                url: `${api}/${id}`,
                data: formData,
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
      }
      console.log("data", formData);
    } catch (err) {
      console.log((err as AxiosError).message);
      notifyError((err as AxiosError).message);
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
          + Add Attribute Group
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
                    <span>ADD Attribute Group</span>
                  </p>
                ) : (
                  <p className="text-center text-white mt-4 fw-bold">
                    <span>UPDATE Attribute Group</span>
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
                    placeholder="Enter Attribute Group Name"
                  />
                </div>
                <div className="col mb-3">
                  <div className="row d-flex justify-content-between">
                    <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                      <label
                        htmlFor="parentId"
                        className="form-label text-white"
                      >
                        Parent Sector
                      </label>
                      <select
                        className="form-select form-select-sm"
                        aria-label="Default select example"
                        name="parentId"
                        onChange={handleChange}
                      >
                        <option value={0}>None</option>
                        {data.length > 0 ? (
                          data?.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>Loading...</option>
                        )}
                      </select>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 text-start">
                      <label htmlFor="sector" className="form-label text-white">
                        Sort ID
                      </label>
                      <div className="row bg-light d-flex rounded-pill">
                        <div className="col ps-1 pt-1 pb-1">
                          <button
                            className="btn bg-color-sea-green rounded rounded-pill p-0"
                            type="button"
                            onClick={() => {
                              if (formData.sortId !== 0) {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  sortId: prevData.sortId - 1,
                                }));
                              }
                            }}
                          >
                            <Image
                              className="p-1"
                              src={minus}
                              alt="minus"
                              width={25}
                              height={20}
                            />
                          </button>
                        </div>
                        <div className="col p-0 d-flex align-items-center justify-content-center">
                          <input
                            type="number"
                            name="sortId"
                            id="sortId"
                            value={formData.sortId}
                            onChange={handleChange}
                            className="form-control form-control-sm p-0 sortId text-center border-0 bg-light"
                          />
                        </div>
                        <div className="col text-end pe-1 pt-1 pb-1">
                          <button
                            className="btn bg-color-sea-green rounded rounded-pill p-0"
                            type="button"
                            onClick={() => {
                              setFormData((prevData) => ({
                                ...prevData,
                                sortId: prevData.sortId + 1,
                              }));
                            }}
                          >
                            <Image
                              src={plus}
                              alt="plus"
                              className="p-1"
                              width={25}
                              height={20}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
                  <label
                    htmlFor="description"
                    className="form-label text-white"
                  >
                    Description
                  </label>
                  <textarea
                    className="form-control form-control-sm"
                    value={formData.description}
                    onChange={handleChange}
                    name="description"
                    placeholder="Write Brief Description..."
                    id="description"
                    style={{ height: "100px" }}
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

export default Form;
