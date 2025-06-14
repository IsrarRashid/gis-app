"use client";
import Button from "@/app/components/Button";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import more from "@/public/icons/more.svg";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { createdMessage, updatedMessage } from "@/app/utils";

interface Role {
  value: string;
  attributeId: number;
  sortId: number;
  isActive: number;
  label: string;
  createdAt: string;
  updatedAt: string;
}

const schema = z.object({
  id: z.number().optional().default(0),
  name: z.string().min(1, { message: "Please add Department Name!" }),
  logo: z.string().optional().default(""),
  address: z.string().optional().default(""),
  email: z.string().email().optional().default(""),
  phoneNumber: z.string().optional().default(""),
});

type Department = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
}

const Form = ({ api, method, id }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Department>({ resolver: zodResolver(schema) });
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [rolesData, setRolesData] = useState<Role[]>([
    {
      attributeId: 0,
      value: "",
      sortId: 0,
      isActive: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      label: "",
    },
  ]);

  const handleDeleteRole = (index: number) => {
    setRolesData((prevData) => prevData.filter((_, i) => i !== index));
  };

  // Function to handle adding new option
  const addNewRole = () => {
    setRolesData((prevOptions) => [
      ...prevOptions,
      {
        value: "",
        attributeId: 0,
        sortId: 0,
        isActive: 0,
        label: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

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
        setValue("logo", itemData.logo);
        setValue("address", itemData.address);
        setValue("email", itemData.email);
        setValue("phoneNumber", itemData.phoneNumber);
      } catch (err) {
        console.log((err as AxiosError).message);
        toast.error((err as AxiosError).message);
      }
    }
  };

  const onSubmit = async (formData: Department) => {
    console.log("Form Data:", formData);
    console.log(errors);

    // const modifiedFormData = {
    //   ...formData,
    // };
    try {
      const response = await apiClient({
        method: method,
        url: method === "POST" ? api : `${api}/${id}`,
        data: formData,
      });
      console.log("Response:", response);
      toast.success(method === "POST" ? createdMessage : updatedMessage);
      router.refresh();
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
                  {method === "POST"
                    ? "ADD New DEPARTMENT"
                    : "UPDATE DEPARTMENT"}
                </p>
              </div>
              <form className="ps-5 pe-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="row m-0">
                  <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label htmlFor="name" className="form-label text-white">
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
                      <p className="text-danger mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label
                      htmlFor="phoneNumber"
                      className="form-label text-white"
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
                      <p className="text-danger mt-1">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label htmlFor="address" className="form-label text-white">
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
                      <p className="text-danger mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label htmlFor="email" className="form-label text-white">
                      email
                    </label>
                    <input
                      {...register("email")}
                      id="email"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="your@company.com"
                    />
                    {errors.email && (
                      <p className="text-danger mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  {/* <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label htmlFor="logo" className="form-label text-white">
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
                      <p className="text-danger mt-1">{errors.logo.message}</p>
                    )}
                  </div> */}
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
