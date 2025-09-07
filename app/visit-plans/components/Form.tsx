"use client";
import Button from "@/app/components/Button";
import { Authentication } from "@/app/hooks/useAuthentication";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Image from "next/image";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import more from "../../../public/icons/more.svg";
import FormWrapper from "@/app/components/Form/FormWrapper";
import CustomLabel from "@/app/components/Form/CustomLabel";
import CustomInput from "@/app/components/Form/CustomInput";
import SubmitButton from "@/app/components/Form/SubmitButton";

const schema = z.object({
  id: z.number().optional().default(0),
  name: z.string().min(1, { message: "Please add Name!" }),
  tourStartDate: z.string().optional().default(new Date().toISOString()),
  tourEndDate: z.string().optional().default(new Date().toISOString()),
  approvalDate: z.string().optional().default(new Date().toISOString()),
  createdDate: z.string().optional().default(new Date().toISOString()),
  updatedDate: z.string().optional().default(new Date().toISOString()),
  createdBy: z.number().default(0),
  updatedBy: z.number().default(0),
});

type TourPlan = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  setData: React.Dispatch<React.SetStateAction<TourPlan[]>>;
  users: Authentication[];
}

const Form = ({
  api,
  method,
  id,
  setRefresh,
  refresh,
  setData,
  users,
}: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TourPlan>({ resolver: zodResolver(schema) });
  const [show, setShow] = useState(false);

  const createdMessage = "Created Successfully";
  const updatedMessage = "Updated Successfully";

  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = async () => {
    const userName = Cookies.get("userName");
    if (userName) {
      setUserName(userName);
      const userId = users.find((user) => user.userName === userName)?.id;
      setUserId(userId ? userId : 1);
    }
    console.log(userId);
    console.log(userName);

    setShow(true);
    if (method === "PUT" && userId) {
      try {
        const response = await apiClient.get(`${api}/${id}`);
        const itemData = response.data.data;
        setValue("id", itemData.id);
        setValue("name", itemData.name);
        setValue("tourStartDate", itemData.tourStartDate);
        setValue("tourEndDate", itemData.tourEndDate);
        setValue("approvalDate", itemData.approvalDate);
        setValue("createdDate", itemData.createdAt);
        setValue("updatedDate", new Date().toISOString());
        setValue("createdBy", itemData.userId ? itemData.userId : userId);
        setValue("updatedBy", userId);
      } catch (err) {
        console.log((err as AxiosError).message);
        toast.error((err as AxiosError).message);
      }
    }
  };

  const onSubmit = async (formData: TourPlan) => {
    console.log("Form Data:", formData);
    console.log(errors);

    const modifiedFormData = {
      ...formData,
      createdBy: userId,
      updatedBy: userId,
    };
    console.log("modifiedFormData", modifiedFormData);
    try {
      const response = await apiClient({
        method: method,
        url: method === "POST" ? api : `${api}/${id}`,
        data: modifiedFormData,
      });
      console.log("Response:", response);
      setData((prevData) => [...prevData, response.data.data]);
      toast.success(method === "POST" ? createdMessage : updatedMessage);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
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
          "+ VisitPlan"
        ) : (
          <Image src={more} alt="more" width={20} height={20} />
        )}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="custom-modal"
        id={`formModal-${id}`}
      >
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          <FormWrapper
            heading={method === "POST" ? "Add Visit Plan" : "Update Visit Plan"}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className="row g-2 g-lg-3 mt-0"
                style={{ marginBottom: "5px" }}
              >
                <div
                  className="col-lg-6 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="name">Name</CustomLabel>
                  <CustomInput
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="Enter Name"
                  />
                  {/* <label htmlFor="name" className="form-label text-white">
                    Name
                  </label>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter TourPlan Name"
                  /> */}
                  {errors.name && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-6 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="tourStartDate">
                    Tour Start Date
                  </CustomLabel>
                  <CustomInput
                    {...register("tourStartDate")}
                    id="tourStartDate"
                    type="text"
                    placeholder="Enter Tour Start Date"
                  />
                  {/* <label
                    htmlFor="tourStartDate"
                    className="form-label text-white"
                  >
                    Tour Start Date
                  </label>
                  <input
                    {...register("tourStartDate")}
                    id="tourStartDate"
                    type="date"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Tour Start Date"
                  /> */}
                  {errors.tourStartDate && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.tourStartDate.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-6 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="tourEndDate">Tour End Date</CustomLabel>
                  <CustomInput
                    {...register("tourEndDate")}
                    id="tourEndDate"
                    type="text"
                    placeholder="Enter Tour End Date"
                  />
                  {/* <label
                    htmlFor="tourEndDate"
                    className="form-label text-white"
                  >
                    Tour End Date
                  </label>
                  <input
                    {...register("tourEndDate")}
                    id="tourEndDate"
                    type="date"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Tour End Date"
                  /> */}
                  {errors.tourEndDate && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.tourEndDate.message}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-6 col-md-6 col-sm-12 text-start mt-0"
                  style={{ marginBottom: "10px", padding: "0px 10px" }}
                >
                  <CustomLabel htmlFor="approvalDate">
                    Approval Date
                  </CustomLabel>
                  <CustomInput
                    {...register("approvalDate")}
                    id="approvalDate"
                    type="text"
                    placeholder="Enter Approval Date"
                  />
                  {/* <label
                    htmlFor="approvalDate"
                    className="form-label text-white"
                  >
                    Approval Date
                  </label>
                  <input
                    {...register("approvalDate")}
                    id="approvalDate"
                    type="date"
                    className="form-control form-control-sm color-light-dark"
                    placeholder="Enter Approval Date"
                  /> */}
                  {errors.approvalDate && (
                    <p className="text-danger mt-1 mb-0">
                      {errors.approvalDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-lg-5 col-md-8 col-sm-6 mx-auto">
                <SubmitButton>Save Visit Plan</SubmitButton>
              </div>
            </form>
          </FormWrapper>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;
