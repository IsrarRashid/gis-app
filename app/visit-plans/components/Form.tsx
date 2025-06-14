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
      <div>
        <Toaster />
      </div>
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
          <div
            className="container-fluid pt-3 pb-3 ps-4 pe-4"
            style={{
              backgroundImage:
                "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6) ,rgba(255, 255, 255, 0.08))",
              borderRadius: "15px",
              border: "1.7px solid rgba(255, 255, 255, 0.6)",
            }}
          >
            <div className="row flex-column justify-content-center mb-4">
              <div className="col-lg-12">
                <p
                  className="text-center text-white mt-4"
                  style={{ fontSize: "1.5rem", fontWeight: "800" }}
                >
                  {method === "POST" ? "ADD Visit Plan" : "UPDATE Visit Plan"}
                </p>
              </div>
              <form className="ps-5 pe-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="row d-flex m-0 justify-content-between">
                  <div className="col mb-3">
                    <label htmlFor="name" className="form-label text-white">
                      Name
                    </label>
                    <input
                      {...register("name")}
                      id="name"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter TourPlan Name"
                    />
                    {errors.name && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="col mb-3">
                    <label
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
                    />
                    {errors.tourStartDate && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.tourStartDate.message}
                      </p>
                    )}
                  </div>
                  <div className="col mb-3">
                    <label
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
                    />
                    {errors.tourEndDate && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.tourEndDate.message}
                      </p>
                    )}
                  </div>
                  <div className="col mb-3">
                    <label
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
                    />
                    {errors.approvalDate && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.approvalDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-lg-8 col-md-8 col-sm-6 mx-auto">
                  <Button
                    className="btn text-white w-100 border-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, #0C8CE9 ,#136AAA)",
                      borderRadius: "12px",
                    }}
                    type="submit"
                  >
                    Done
                  </Button>
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
