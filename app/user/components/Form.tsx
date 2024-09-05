import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import plus from "../../../public/icons/plus.svg";
import minus from "../../../public/icons/minus.svg";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import more from "../../../public/icons/more.svg";

interface Form {
  name: string;
  email: string;
  phone: string;
  roleId: number;
  password: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}

const Form = ({ api, method, id, setRefresh, refresh }: Props) => {
  const [formData, setFormData] = useState<Form>({
    name: "",
    email: "",
    phone: "",
    roleId: 0,
    password: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [show, setShow] = useState(false);

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
            name: itemData.name,
            email: itemData.email,
            phone: itemData.phone,
            roleId: itemData.roleId,
            password: itemData.password,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        roleId: 0,
        password: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
          console.log("response", response);
          setRefresh((prev) => !prev);
          setFormData({
            name: "",
            email: "",
            phone: "",
            roleId: 0,
            password: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
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
        } else {
          console.log("api is wrong");
        }
      }
      // notifyCreate(created);
      // handle the response and perform any necessary actions
      console.log("data", formData);
    } catch (err) {
      // notifyError(errorMessage);
      console.log((err as AxiosError).message);
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
          + Add User
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
                    <span>ADD USER</span>
                  </p>
                ) : (
                  <p className="text-center text-white mt-4 fw-bold">
                    <span>UPDATE USER</span>
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
                    placeholder="Enter Username"
                  />
                </div>
                <div className="col mb-3">
                  <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
                    <label htmlFor="email" className="form-label text-white">
                      email
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="row d-flex justify-content-between">
                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3 text-start">
                      <label htmlFor="phone" className="form-label text-white">
                        Phone
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter Phone Name"
                      />
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 text-start">
                      <label
                        htmlFor="roleId"
                        className="form-label text-white mb-1"
                      >
                        Role ID
                      </label>
                      <div className="row bg-light d-flex rounded-pill">
                        <div className="col ps-1 pt-1 pb-1">
                          <button
                            className="btn bg-color-sea-green rounded rounded-pill p-0"
                            type="button"
                            onClick={() => {
                              if (formData.roleId !== 0) {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  roleId: prevData.roleId - 1,
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
                            name="roleId"
                            id="roleId"
                            value={formData.roleId}
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
                                roleId: prevData.roleId + 1,
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
                  <label htmlFor="password" className="form-label text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
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
      </Modal>
    </>
  );
};

export default Form;
