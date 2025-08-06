import Button from "@/app/components/Button";
import { Role } from "@/app/hooks/useRoles";
import apiClient, {
  AxiosError,
  ErrorResponse,
} from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import more from "../../../public/icons/more.svg";
import useDepartments from "@/app/hooks/useDepartments";

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

  userProfile: z.object({
    id: z.number().optional().default(0),
    department_Id: z.number().optional().default(0),
    user_Id: z.number().optional().default(0),
    firstName: z.string().min(1, { message: "Please add First Name!" }),
    lastName: z.string().min(1, { message: "Please add Last Name!" }),
    profilePicture: z.string().optional().default(""),
    designation: z.string().optional().default(""),
    budget_Code: z.string().optional().default(""),
    vendor_Code: z.string().optional().default(""),
    bps: z.number().optional().default(0),
    status: z.boolean().optional().default(true),
    section: z.string().optional().default(""),
  }),
});

type User = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  roles: Role[];
}

const Form = ({ api, method, id, setRefresh, refresh, roles }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<User>({ resolver: zodResolver(schema) });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

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
    setPreviewUrl(null);
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
      toast.error(
        (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
          (err as AxiosError<ErrorResponse>).message
      );
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
          "+ User"
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
                <div className="row d-flex justify-content-between mb-3">
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="firstName"
                      className="form-label text-white"
                    >
                      First Name
                    </label>
                    <input
                      {...register("userProfile.firstName")}
                      id="firstName"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter first Name"
                    />
                    {errors?.userProfile?.firstName && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.userProfile.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="lastName" className="form-label text-white">
                      Last Name
                    </label>
                    <input
                      {...register("userProfile.lastName")}
                      id="lastName"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter Last Name"
                    />
                    {errors?.userProfile?.lastName && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.userProfile.lastName.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="username" className="form-label text-white">
                      UserName
                    </label>
                    <input
                      {...register("username")}
                      id="username"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter User Name"
                      autoComplete="username"
                    />
                    {errors.username && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="email" className="form-label text-white">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      id="email"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter Email"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="designation"
                      className="form-label text-white"
                    >
                      Designation
                    </label>
                    <input
                      {...register("userProfile.designation")}
                      id="designation"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter Designation"
                    />
                    {errors?.userProfile?.designation && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.userProfile.designation.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 text-start">
                    <label htmlFor="roleID" className="form-label text-white">
                      Role
                    </label>
                    <select
                      id="roleID"
                      {...register("roleID", { valueAsNumber: true })}
                      className="form-select form-select-sm color-light-dark"
                    >
                      <option value="">None</option>
                      {roles?.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    {errors.roleID && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.roleID.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="password" className="form-label text-white">
                      Password
                    </label>
                    <input
                      {...register("password")}
                      id="password"
                      type="password"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter Password"
                      autoComplete="new-password"
                    />
                    {errors.password && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 text-start">
                    <label htmlFor="bps" className="form-label text-white">
                      BPS
                    </label>
                    <select
                      id="bps"
                      {...register("userProfile.bps", { valueAsNumber: true })}
                      className="form-select form-select-sm color-light-dark"
                    >
                      <option value="0">None</option>
                      {Array.from({ length: 22 }, (_, i) => i + 1)?.map(
                        (num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        )
                      )}
                    </select>
                    {errors?.userProfile?.bps && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.userProfile.bps.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 text-start">
                    <label htmlFor="section" className="form-label text-white">
                      Section
                    </label>
                    <select
                      id="section"
                      {...register("userProfile.section")}
                      className="form-select form-select-sm color-light-dark"
                    >
                      <option value="">None</option>
                      <option value="M">M</option>
                      <option value="E">E</option>
                    </select>
                    {errors?.userProfile?.section && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.userProfile.section.message}
                      </p>
                    )}
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="profilePicture"
                      className="form-label text-white"
                    >
                      Profile Picture
                    </label>
                    <input
                      id="profilePicture"
                      type="file"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Select Profile Picture"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    {errors?.userProfile?.profilePicture && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.userProfile.profilePicture.message}
                      </p>
                    )}
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="rounded-circle overflow-hidden"
                        style={{
                          marginTop: "10px",
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
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
