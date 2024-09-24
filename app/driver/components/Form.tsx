import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import { useState } from "react";
import more from "../../../public/icons/more.svg";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";

const schema = z.object({
  id: z.number().optional().default(0),
  driverName: z.string().min(1, { message: "Please add Driver Name!" }),
  mobileNumber: z.string().min(1, { message: "Please add Phone Number!" }),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updatedAt: z.string().optional().default(new Date().toISOString()),
});

type Driver = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}

const Form = ({ api, method, id, setRefresh, refresh }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Driver>({ resolver: zodResolver(schema) });
  const [show, setShow] = useState(false);

  const createdMessage = "Created Successfully";
  const updatedMessage = "Updated Successfully";

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const handleShow = async () => {
    setShow(true);
    if (method === "PUT") {
      try {
        const response = await apiClient.get(`${api}/${id}`);
        const itemData = response.data.data;
        setValue("id", itemData.id);
        setValue("driverName", itemData.driverName);
        setValue("mobileNumber", itemData.mobileNumber);
        setValue("createdAt", itemData.createdAt);
        setValue("updatedAt", new Date().toISOString());
      } catch (err) {
        console.log((err as AxiosError).message);
        toast.error((err as AxiosError).message);
      }
    }
  };

  const onSubmit = async (formData: Driver) => {
    console.log("Form Data:", formData);
    console.log(errors);
    try {
      const response = await apiClient({
        method: method,
        url: api,
        data: formData,
      });
      console.log("Response:", response);
      setRefresh((prev) => !prev);
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
      <button
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
          "+ Driver"
        ) : (
          <Image src={more} alt="more" width={25} height={25} />
        )}
      </button>

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
            <div className="col-lg-12">
              <p
                className="text-center text-white mt-4"
                style={{ fontSize: "1.5rem", fontWeight: "800" }}
              >
                {method === "POST" ? "ADD DRIVER" : "UPDATE DRIVER"}
              </p>
            </div>
            <form className="ps-5 pe-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="row d-flex justify-content-between mb-3">
                <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
                  <label htmlFor="driverName" className="form-label text-white">
                    Driver Name
                  </label>
                  <input
                    {...register("driverName")}
                    id="driverName"
                    type="text"
                    className="form-control form-control-sm color-light-dark bg-silver"
                    placeholder="Enter Driver Name"
                  />
                  {errors.driverName && (
                    <p className="text-danger mt-1">
                      {errors.driverName.message}
                    </p>
                  )}
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
                  <label
                    htmlFor="mobileNumber"
                    className="form-label text-white"
                  >
                    Mobile Number
                  </label>
                  <input
                    {...register("mobileNumber")}
                    id="mobileNumber"
                    type="text"
                    className="form-control form-control-sm color-light-dark bg-silver"
                    placeholder="Enter Mobile Number"
                  />
                  {errors.mobileNumber && (
                    <p className="text-danger mt-1">
                      {errors.mobileNumber.message}
                    </p>
                  )}
                </div>
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;
