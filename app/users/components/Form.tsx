import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import { useState } from "react";
import more from "../../../public/icons/more.svg";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import useRoles from "@/app/hooks/useRoles";
import axios from "axios";

const schema = z.object({
  username: z
    .string()
    .min(1, { message: "Please add Name!" })
    .regex(/^\S*$/, { message: "Username should not contain spaces!" }),
  email: z
    .string()
    .min(1, { message: "Please add Email!" })
    .email({ message: "Please enter valid email!" }),
  password: z
    .string()
    .min(8, { message: "Please add Password!" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter!",
    })
    .regex(/\d/, { message: "Password must contain atleast on number!" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least on special character!",
    }),
  roleID: z
    .preprocess(
      (val) => (val === "" || val === undefined ? undefined : String(val)),
      z.string({ invalid_type_error: "Please add Role Id!" })
    )
    .optional()
    .default(""),
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
  const { data: rolesData } = useRoles({ refresh });
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
        setValue("username", itemData.username);
        setValue("email", itemData.email);
        setValue("password", itemData.password);
        setValue("roleID", itemData.roleID);
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
                  {method === "POST" ? "ADD USER" : "UPDATE USER"}
                </p>
              </div>
              <form className="ps-5 pe-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="row d-flex justify-content-between">
                  <div className="col-lg-6 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="username" className="form-label text-white">
                      UserName
                    </label>
                    <input
                      {...register("username")}
                      id="username"
                      type="text"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter User Name"
                    />
                    {errors.username && (
                      <p className="text-danger mt-1">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="email" className="form-label text-white">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      id="email"
                      type="text"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter Email"
                    />
                    {errors.email && (
                      <p className="text-danger mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div className="row d-flex justify-content-between">
                  <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                    <label htmlFor="roleID" className="form-label text-white">
                      Role
                    </label>
                    <select
                      {...register("roleID", { valueAsNumber: true })}
                      className="form-select form-select-sm color-light-dark bg-silver"
                    >
                      <option value="">None</option>
                      {rolesData?.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    {errors.roleID && (
                      <p className="text-danger mt-1">
                        {errors.roleID.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="password" className="form-label text-white">
                      Password
                    </label>
                    <input
                      {...register("password")}
                      id="password"
                      type="password"
                      className="form-control form-control-sm color-light-dark bg-silver"
                      placeholder="Enter Password"
                    />
                    {errors.password && (
                      <p className="text-danger mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
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

export default Form;
