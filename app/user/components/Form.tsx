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
  name: z.string().min(1, { message: "Please add Name!" }),
  email: z
    .string()
    .min(1, { message: "Please add Email!" })
    .email({ message: "Please enter valid email!" }),
  phone: z.string().optional().default(""),
  roleId: z
    .preprocess(
      (val) => (val === "" ? undefined : val),
      z.number({ invalid_type_error: "Please add Role Id!" })
    )
    .optional()
    .default(0),
  password: z.string().min(1, { message: "Please add Password!" }),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updatedAt: z.string().optional().default(new Date().toISOString()),
});

type User = z.infer<typeof schema>;

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
  } = useForm<User>({ resolver: zodResolver(schema) });
  // console.log(errors);
  const modalId = `formModal-${id}`;
  const createdMessage = "Created Successfully";
  const updatedMessage = "Updated Successfully";

  const handleClose = () => {
    setShow(false);
    reset();
  };
  const [show, setShow] = useState(false);

  const handleShow = async () => {
    setShow(true);

    if (method === "PUT") {
      try {
        const response = await apiClient.get(`${api}/${id}`);
        const itemData = response.data.data;
        setValue("id", itemData.id);
        setValue("name", itemData.name);
        setValue("email", itemData.email);
        setValue("phone", itemData.phone);
        setValue("roleId", itemData.roleId);
        setValue("password", itemData.password);
        setValue("createdAt", itemData.createdAt);
        setValue("updatedAt", new Date().toISOString());
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onSubmit = async (formData: User) => {
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
          "+ User"
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
                  {method === "POST" ? "ADD USER" : "UPDATE USER"}
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
                    placeholder="Enter User Name"
                  />
                  {errors.name && (
                    <p className="text-danger mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div className="col mb-3">
                  <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
                    <label htmlFor="email" className="form-label text-white">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      id="email"
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Enter Email"
                    />
                    {errors.email && (
                      <p className="text-danger mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="row d-flex justify-content-between">
                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3 text-start">
                      <label htmlFor="phone" className="form-label text-white">
                        Phone
                      </label>
                      <input
                        {...register("phone")}
                        id="phone"
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Enter Phone"
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                      <label htmlFor="roleId" className="form-label text-white">
                        Role Id
                      </label>
                      <input
                        {...register("roleId", { valueAsNumber: true })}
                        id="roleId"
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Enter Role ID"
                      />
                      {errors.roleId && (
                        <p className="text-danger mt-1">
                          {errors.roleId.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
                  <label htmlFor="password" className="form-label text-white">
                    Password
                  </label>
                  <input
                    {...register("password")}
                    id="password"
                    type="password"
                    className="form-control form-control-sm"
                    placeholder="Enter Password"
                  />
                  {errors.password && (
                    <p className="text-danger mt-1">
                      {errors.password.message}
                    </p>
                  )}
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
