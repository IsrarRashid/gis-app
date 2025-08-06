"use client";
import Button from "@/app/components/Button";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import more from "../../../public/icons/more.svg";
import { FaPlus } from "react-icons/fa";
import { data } from "@/app/dashboard/components/reportAnalysisData";
import { DepartmentRight } from "@/app/hooks/useDepartments";

const departmentSchema = z.object({
  id: z.number().optional().default(0),
  name: z.string().min(1, { message: "Please add Department Name!" }),
  // shortName: z.string().min(1, { message: "Please add Short Name!" }),
  logo: z.string().optional().default("-"),
  address: z.string().optional().default(""),
  email: z.string().email().optional().default(""),
  phoneNumber: z.string().optional().default(""),
});

const departmentRightSchema = z.object({
  id: z.number().optional().default(0),
  department_Id: z.number().optional().default(0),
  fieldName: z.string(),
  fieldValue: z.string(),
});

export const schema = z.object({
  department: departmentSchema,
  departmentRights: z.array(departmentRightSchema).optional().default([]),
});

type DepartmentWithRights = z.infer<typeof departmentSchema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  setData: React.Dispatch<React.SetStateAction<DepartmentWithRights[]>>;
}

const Form = ({ api, method, id, setRefresh, setData }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DepartmentWithRights>({ resolver: zodResolver(schema) });
  const [show, setShow] = useState(false);

  const createdMessage = "Created Successfully";
  const updatedMessage = "Updated Successfully";

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = async () => {
    setShow(true);
    // if (method === "PUT") {
    //   try {
    //     const response = await apiClient.get(`${api}/${id}`);
    //     const itemData = response.data.data;
    //     setValue("id", itemData.id);
    //     setValue("name", itemData.name);
    //     setValue("logo", itemData.logo);
    //     setValue("address", itemData.address);
    //     setValue("email", itemData.email);
    //     setValue("phoneNumber", itemData.phoneNumber);
    //   } catch (err) {
    //     console.log((err as AxiosError).message);
    //     toast.error((err as AxiosError).message);
    //   }
    // }
  };

  const [rightsData, setRightsData] = useState<DepartmentRight[]>([
    {
      id: 0,
      department_Id: 0,
      fieldName: "",
      fieldValue: "",
    },
  ]);

  const handleDeleteRight = (index: number) => {
    setRightsData((prevData) => prevData.filter((_, i) => i !== index));
  };

  // Function to handle adding new option
  const addNewRole = () => {
    setRightsData((prevOptions) => [
      ...prevOptions,
      {
        id: 0,
        department_Id: 0,
        fieldName: "",
        fieldValue: "",
      },
    ]);
  };

  const onSubmit = async (formData: DepartmentWithRights) => {
    console.log("Form Data:", formData);
    console.log(errors);

    // const modifiedFormData = {
    //   ...formData,
    //   parentId: formData.parentId === 0 ? null : formData.parentId,
    // };

    try {
      const response = await apiClient({
        method: method,
        url: method === "POST" ? api : `${api}/${id}`,
        data: formData,
      });
      console.log("Response:", response);
      setRefresh((prev) => !prev);
      // setData((prevData) => [...prevData, response.data.data]);
      toast.success(method === "POST" ? createdMessage : updatedMessage);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
  };

  const handleRightChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setRightsData((prevOptions) =>
      prevOptions.map((option, i) =>
        i === index ? { ...option, [name]: value } : option
      )
    );
  };

  return (
    <>
      <Button
        type="button"
        className={`btn shadow ${
          method === "POST"
            ? "text-white bg-color-sea-green"
            : "rounded-pill ps-3 pe-3 pt-1 pb-1"
        }`}
        onClick={handleShow}
        style={{
          background: method === "POST" ? "" : "rgba(255, 255, 255,.5)",
        }}
      >
        {method === "POST" ? (
          "+ Department"
        ) : (
          <Image src={more} alt="more" width={20} height={20} />
        )}
      </Button>

      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="new-custom-modal"
        id={`formModal-${id}`}
      >
        <Modal.Header
          // className="bg-blur py-0 px-4"
          className="py-0 px-4"
          style={{ borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
          closeButton
        >
          <Modal.Title>
            <p className="text-center mt-4 fs18px fw-6">
              {method === "POST" ? "ADD NEW DEPARTMENT" : "UPDATE DEPARTMENT"}
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          <div
            // className="container-fluid pt-3 pb-3 ps-4 pe-4 bg-blur"
            className="container-fluid pt-3 pb-3 ps-4 pe-4"
            style={
              {
                // backgroundImage:
                //   "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6) ,rgba(255, 255, 255, 0.08))",
                // borderRadius: "12px",
                // border: "1.7px solid rgba(255, 255, 255, 0.6)",
              }
            }
          >
            <div className="row flex-column justify-content-center">
              <div className="col-lg-12"></div>
              <form className="px-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="row m-0">
                  <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label htmlFor="name" className="form-label fs14px fw-5">
                      Department Name
                    </label>
                    <input
                      {...register("name")}
                      id="name"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="e.g. DGME"
                    />
                    {errors.name && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label
                      htmlFor="phoneNumber"
                      className="form-label fs14px fw-5"
                    >
                      Phone Number
                    </label>
                    <input
                      {...register("phoneNumber")}
                      id="phoneNumber"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter Phone Number"
                    />
                    {errors.phoneNumber && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label htmlFor="address" className="form-label fs14px fw-5">
                      Addresss
                    </label>
                    <input
                      {...register("address")}
                      id="address"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter your Addresss"
                    />
                    {errors.address && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label htmlFor="email" className="form-label fs14px fw-5">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      id="email"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="your@company.com"
                    />
                    {errors.email && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <>
                    <div className="row d-flex justify-content-between align-items-center mb-3">
                      <div className="col-auto my-auto">
                        <h5 className="fs18px fw-6">Add Roles</h5>
                      </div>
                      <div className="col-auto">
                        {/* <Button
                          type="button"
                          onClick={addNewRole}
                          className="btn rounded-circle border border-dark bg-white"
                        >
                          <FaPlus />
                        </Button> */}
                      </div>
                    </div>
                    <hr />
                    {rightsData?.map((right, index) => (
                      <div
                        key={index}
                        className="row d-flex justify-content-between mb-3"
                      >
                        <div className="col-5 text-start">
                          <select
                            id={`value-${index}`}
                            // onChange={(e) => handleRightChange(index, e)}
                            className="form-select form-select-sm color-light-dark"
                          >
                            <option value="">Select</option>
                            <option value="sponsoring_id">Sponsoring ID</option>
                          </select>
                        </div>
                        <div className="col-5 text-start">
                          <select
                            id={`value-${index}`}
                            // onChange={(e) => handleRightChange(index, e)}
                            className="form-select form-select-sm color-light-dark"
                          >
                            <option value="">Select</option>
                            <option value="sponsoring_id">Sponsoring ID</option>
                          </select>
                        </div>

                        <div className="col-lg-2 col-md-6 col-sm-4 mx-auto">
                          <Button
                            type="button"
                            onClick={addNewRole}
                            className="btn rounded-circle border border-dark bg-white"
                          >
                            <FaPlus />
                          </Button>
                          {/* <Button
                            className="btn btn-danger text-white w-100"
                            type="button"
                            onClick={() => handleDeleteRight(index)}
                          >
                            Delete
                          </Button> */}
                        </div>
                      </div>
                    ))}
                  </>
                  {/* <div className="col mb-3">
                    <p className="mt-4 fs18px fw-6 ">Add Roles</p>
                    <div className="row">
                      <div className="col-6 text-start">
                        <select className="form-select form-select-sm color-light-dark">
                          <option value="">Select</option>
                          <option value="sponsoring_id">Sponsoring ID</option>
                        </select>
                      </div>
                      <div className="col-5 text-start ps-0">
                        <select className="form-select form-select-sm color-light-dark">
                          <option value="">Select</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                      <div className="col-auto text-end ps-0">
                        <Button
                          type="button"
                          className="btn rounded-circle border border-dark bg-white"
                        >
                          <FaPlus />
                        </Button>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label htmlFor="logo" className="form-label fs14px fw-5">
                      Logo
                    </label>
                    <input
                      {...register("logo")}
                      id="logo"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Select your logo"
                    />
                    {errors.logo && (
                      <p className="text-danger mt-1 fs14px">{errors.logo.message}</p>
                    )}
                  </div> */}
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col col-12 col-sm-12 col-md-4 col-lg-3 mb-2">
                    <Button
                      className="btn btn-light w-100 border rounded-pill fs13px"
                      style={{ paddingTop: "9px", paddingBottom: "9px" }}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="col col-12 col-sm-12 col-md-4 col-lg-3">
                    <Button
                      className="btn text-white w-100 border-0 rounded-pill fs13px"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #0C8CE9 ,#1A67A0)",
                        paddingTop: "9px",
                        paddingBottom: "9px",
                      }}
                      type="submit"
                    >
                      Save
                    </Button>
                  </div>
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
