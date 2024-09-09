import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import { FormEvent, useState } from "react";
import more from "../../../public/icons/more.svg";
// import { ToastContainer, toast } from "react-toastify";
import useAttributeGroups from "@/app/hooks/useAttributeGroups";
import apiClient, { AxiosError } from "@/app/services/api-client";
import Counter from "@/app/components/Counter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";

const schema = z.object({
  id: z.number().optional().default(0),
  parentId: z.number().optional().default(0),
  name: z.string().min(1, { message: "Please add Name!" }),
  description: z.string().optional().default(""),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updatedAt: z.string().optional().default(new Date().toISOString()),
  sortId: z.number({ invalid_type_error: "Please add Sort Id!" }),
});

type AttributeGroup = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}

const Form = ({ api, method, id, setRefresh, refresh }: Props) => {
  const { data, setError } = useAttributeGroups({ refresh });
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AttributeGroup>({ resolver: zodResolver(schema) });
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
        const response = await apiClient.get(`${api}/${id}`);
        const itemData = response.data.data;
        setValue("id", itemData.id);
        setValue("parentId", itemData.parentId);
        setValue("name", itemData.name);
        setValue("description", itemData.description);
        setValue("sortId", itemData.sortId);
        setValue("createdAt", new Date().toISOString());
        setValue("updatedAt", new Date().toISOString());
      } catch (err) {
        console.log((err as AxiosError).message);
        setError((err as AxiosError).message);
      }
    }
  };

  const onSubmit = async (formData: AttributeGroup) => {
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
        className={`btn btn-sm ${
          method === "POST" ? "text-white bg-color-sea-green" : "rounded-pill"
        }`}
        onClick={handleShow}
        style={{ background: method === "POST" ? "" : "#fff" }}
      >
        {method === "POST" ? (
          "+ Add Attribute Group"
        ) : (
          <Image src={more} alt="more" />
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
            className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
            style={{
              backgroundImage: "linear-gradient(to left, #969696 ,#d9d9d9)",
              borderRadius: "20px",
            }}
          >
            <div className="row flex-column justify-content-center mb-4">
              <div className="col-lg-12">
                <p className="text-center text-white mt-4 fw-bold">
                  {method === "POST"
                    ? "ADD ATTRIBUTE GROUP"
                    : "UPDATE ATTRIBUTE GROUP"}
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
                    className="form-control form-control-sm"
                    placeholder="Enter Attribute Group Name"
                  />
                  {errors.name && (
                    <p className="text-danger mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div className="col mb-3">
                  <div className="row d-flex justify-content-between">
                    <div className="col-lg-7 col-md-6 col-sm-12 text-start">
                      <label
                        htmlFor="parentId"
                        className="form-label text-white"
                      >
                        Parent Attribute Group
                      </label>
                      <select
                        {...register("parentId", { valueAsNumber: true })}
                        className="form-select form-select-sm"
                      >
                        <option value="0">None</option>
                        {data?.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-lg-5 col-md-6 col-sm-12 text-start">
                      <label htmlFor="sortId" className="form-label text-white">
                        Sort Id
                      </label>
                      <input
                        {...register("sortId", { valueAsNumber: true })}
                        id="sortId"
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Enter Sort ID"
                      />
                      {errors.sortId && (
                        <p className="text-danger mt-1">
                          {errors.sortId.message}
                        </p>
                      )}
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
                    id="description"
                    {...register("description")}
                    className="form-control form-control-sm"
                    placeholder="Write Brief Description..."
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
      </Modal>
    </>
  );
};

export default Form;
