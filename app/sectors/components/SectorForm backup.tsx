import plus from "../../../public/icons/plus.svg";
import minus from "../../../public/icons/minus.svg";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { sectorAPI } from "@/app/APIs";
import Cookies from "js-cookie";
import more from "../../../public/icons/more.svg";

interface Form {
  parentId: number;
  name: string;
  description: string;
  createdAt: string;
  updateAt: string;
  sortId: number;
}

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
}

const SectorForm = ({ api, method, id }: Props) => {
  const [formData, setFormData] = useState<Form>({
    parentId: 0,
    name: "",
    description: "",
    createdAt: new Date().toISOString(),
    updateAt: new Date().toISOString(),
    sortId: 0,
  });

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
          data-bs-toggle="modal"
          data-bs-target="#formModal"
        >
          + Add Sector
        </button>
      ) : (
        <button
          className="btn btn-sm rounded-pill"
          style={{ background: "#fff" }}
          data-bs-toggle="modal"
          data-bs-target="#formModal"
        >
          <Image src={more} alt="more" />
        </button>
      )}

      <div
        className="modal fade"
        id="formModal"
        aria-labelledby="formModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content border-0"
            style={{ background: "rgba(255,255,255,0)" }}
          >
            <div className="modal-body p-0">
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
                        <span>ADD SECTOR</span>
                      </p>
                    ) : (
                      <p className="text-center text-white mt-4 fw-bold">
                        <span>UPDATE SECTOR</span>
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
                        placeholder="Enter Sector Name"
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
                            <option></option>
                            <option value="0">sector name 0</option>
                            <option value="1">sector name 1</option>
                            <option value="2">sector name 2</option>
                            <option value="3">sector name 3</option>
                            <option value="4">sector name 4</option>
                            <option value="5">sector name 5</option>
                          </select>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 text-start">
                          <label
                            htmlFor="sector"
                            className="form-label text-white"
                          >
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectorForm;
