import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import { useState } from "react";
import more from "../../../public/icons/more.svg";
import apiClient, { AxiosError } from "@/app/services/api-client";
import useSectors from "@/app/hooks/useSectors";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";

const schema = z.object({
  id: z.number().optional().default(0),
  sectorId: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.number({ invalid_type_error: "Please add Sector Id!" })
  ),
  name: z.string().min(1, { message: "Please add Name!" }),
  address: z.string().optional().default(""),
  city: z.string().optional().default(""),
  locationCoordinates: z.string().optional().default(""),
  status: z.string().optional().default(""),
});

type Project = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}

const ProjectForm = ({ api, method, id, setRefresh, refresh }: Props) => {
  const { data: sectorsData } = useSectors({ refresh });
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Project>({ resolver: zodResolver(schema) });
  console.log(errors);
  const [show, setShow] = useState(false);
  const modalId = `formModal-${id}`;

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
        // send a request to the server to add the product
        const response = await apiClient.get(`${api}/${id}`);
        const itemData = response.data.data;
        setValue("id", itemData.id);
        setValue("name", itemData.name);
        setValue("sectorId", itemData.sectorId);
        setValue("address", itemData.address);
        setValue("city", itemData.city);
        setValue("locationCoordinates", itemData.locationCoordinates);
        setValue("status", itemData.status);
      } catch (err) {
        console.log((err as AxiosError).message);
        toast.error((err as AxiosError).message);
      }
    }
  };

  const onSubmit = async (formData: Project) => {
    console.log("Form Data:", formData);
    console.log(errors);
    try {
      const response = await apiClient({
        method: method,
        url: method === "POST" ? api : `${api}/${id}`,
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
          "+ Project"
        ) : (
          <Image src={more} alt="more" width={20} height={20} />
        )}
      </button>

      <Modal
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
                  {method === "POST" ? "ADD PROJECT" : "UPDATE PROJECT"}
                </p>
              </div>
              <form className="ps-5 pe-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
                  <label htmlFor="name" className="form-label text-white">
                    Name
                  </label>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    className="form-control form-control-sm color-light-dark bg-silver"
                    placeholder="Enter Project Name"
                  />
                  {errors.name && (
                    <p className="text-danger mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div className="row d-flex justify-content-between">
                  <div className="col-lg-6 col-md-12 col-sm-12 mb-3 text-start">
                    <label htmlFor="address" className="form-label text-white">
                      Address
                    </label>
                    <input
                      {...register("address")}
                      id="address"
                      type="text"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter Address"
                    />
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="city" className="form-label text-white">
                      City
                    </label>
                    <input
                      {...register("city")}
                      id="city"
                      type="text"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter City Name"
                    />
                  </div>
                </div>
                <div className="row d-flex justify-content-between">
                  <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                    <label htmlFor="status" className="form-label text-white">
                      Status
                    </label>
                    <select
                      {...register("status")}
                      className="form-select form-select-sm color-light-dark bg-silver"
                    >
                      <option value="">Select</option>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                    <label htmlFor="sectorId" className="form-label text-white">
                      Sector ID
                    </label>
                    <select
                      {...register("sectorId", { valueAsNumber: true })}
                      className="form-select form-select-sm color-light-dark bg-silver"
                    >
                      <option value="">None</option>
                      {sectorsData?.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    {errors.sectorId && (
                      <p className="text-danger mt-1">
                        {errors.sectorId.message}
                      </p>
                    )}
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
                    {...register("locationCoordinates")}
                    id="locationCoordinates"
                    type="text"
                    className="form-control form-control-sm color-light-dark bg-silver"
                    placeholder="Enter Location Coordinates"
                  />
                </div>
                <div className="col-lg-8 col-md-8 col-sm-6 mx-auto">
                  <button
                    className="btn text-white w-100 border-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, #0C8CE9 ,#136AAA)",
                      borderRadius: "12px",
                    }}
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

export default ProjectForm;
