import Button from "@/app/components/Button";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
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
  description: z.string().min(1, { message: "Please add Description!" }),
  vehicleNumber: z.string().min(1, { message: "Please add Vehicle Number!" }),
  model: z.string().min(1, { message: "Please add Model!" }),
  color: z.string().min(1, { message: "Please add Color!" }),
  trasnmission: z.string().min(1, { message: "Please add Transmission!" }),
  seatsCapacity: z
    .number({ invalid_type_error: "Please add Seats Capacity!" })
    .min(1, { message: "Please add Seats Capacity!" }),
  fuelType: z.string().min(1, { message: "Please add Fuel Type!" }),
  vehicleImage: z.string().default("").nullable(),
  vehicleIcon: z.string().default("").nullable(),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updatedAt: z.string().optional().default(new Date().toISOString()),
});

type Vehicle = z.infer<typeof schema>;

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
  } = useForm<Vehicle>({ resolver: zodResolver(schema) });
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
        setValue("name", itemData.name);
        setValue("description", itemData.description);
        setValue("vehicleNumber", itemData.vehicleNumber);
        setValue("model", itemData.model);
        setValue("color", itemData.color);
        setValue("trasnmission", itemData.trasnmission);
        setValue("seatsCapacity", itemData.seatsCapacity);
        setValue("fuelType", itemData.fuelType);
        setValue("vehicleImage", itemData.vehicleImage);
        setValue("vehicleIcon", itemData.vehicleIcon);
        setValue("createdAt", itemData.createdAt);
        setValue("updatedAt", new Date().toISOString());
      } catch (err) {
        console.log((err as AxiosError).message);
        toast.error((err as AxiosError).message);
      }
    }
  };

  const onSubmit = async (formData: Vehicle) => {
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
          "+ Vehicle"
        ) : (
          <Image src={more} alt="more" width={25} height={25} />
        )}
      </Button>

      <Modal
        size="lg"
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
                  {method === "POST" ? "ADD VEHICLE" : "UPDATE VEHICLE"}
                </p>
              </div>
              <form className="ps-5 pe-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="row d-flex justify-content-between">
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="name" className="form-label text-white">
                      Name
                    </label>
                    <input
                      {...register("name")}
                      id="name"
                      type="text"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter Name"
                    />
                    {errors.name && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="description"
                      className="form-label text-white"
                    >
                      Description
                    </label>
                    <input
                      {...register("description")}
                      id="description"
                      type="text"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter Description"
                    />
                    {errors.description && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="vehicleNumber"
                      className="form-label text-white"
                    >
                      Vehicle Number
                    </label>
                    <input
                      {...register("vehicleNumber")}
                      id="vehicleNumber"
                      type="text"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter vehicleNumber"
                    />
                    {errors.vehicleNumber && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.vehicleNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="model" className="form-label text-white">
                      Model
                    </label>
                    <input
                      {...register("model")}
                      id="model"
                      type="text"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter Model"
                    />
                    {errors.model && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.model.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="color" className="form-label text-white">
                      Color
                    </label>
                    <input
                      {...register("color")}
                      id="color"
                      type="text"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter Color"
                    />
                    {errors.color && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.color.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="trasnmission"
                      className="form-label text-white"
                    >
                      Trasnmission
                    </label>
                    <input
                      {...register("trasnmission")}
                      id="trasnmission"
                      type="text"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter Trasnmission"
                    />
                    {errors.trasnmission && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.trasnmission.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="seatsCapacity"
                      className="form-label text-white"
                    >
                      Seats Capacity
                    </label>
                    <input
                      {...register("seatsCapacity", { valueAsNumber: true })}
                      id="seatsCapacity"
                      type="number"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter Seats Capacity"
                    />
                    {errors.seatsCapacity && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.seatsCapacity.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="fuelType" className="form-label text-white">
                      Fuel Type
                    </label>
                    <input
                      {...register("fuelType")}
                      id="fuelType"
                      type="text"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter fuel Type"
                    />
                    {errors.fuelType && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.fuelType.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="vehicleImage"
                      className="form-label text-white"
                    >
                      vehicle Image
                    </label>
                    <input
                      {...register("vehicleImage")}
                      id="vehicleImage"
                      type="text"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter Vehicle Image"
                    />
                    {errors.vehicleImage && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.vehicleImage.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="vehicleIcon"
                      className="form-label text-white"
                    >
                      Vehicle Icon
                    </label>
                    <input
                      {...register("vehicleIcon")}
                      id="vehicleIcon"
                      type="text"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter Vehicle Icon"
                    />
                    {errors.vehicleIcon && (
                      <p className="text-danger mt-1 mb-0">
                        {errors.vehicleIcon.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-4 mx-auto">
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
