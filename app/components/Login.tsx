"use client";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import eye from "../../public/icons/eye.svg";
import logoNew from "../../public/icons/logoNew.svg";
import passwordGrey from "../../public/icons/passwordGrey.svg";
import userGrey from "../../public/icons/userGrey.svg";
import verticalLineGrey from "../../public/icons/verticalLineGrey.svg";
import bgVideoNew from "../../public/video/bgVideoNew.mp4";
import { loginAPI } from "../APIs";
import apiClient, { AxiosError, ErrorResponse } from "../services/api-client";
import Button from "./Button";
import Spinner from "./Spinner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "./ErrorMessage";

const schema = z.object({
  username: z.string().min(1, { message: "Please add Username!" }),
  password: z.string().min(1, { message: "Please add Password!" }),
});

export type Login = z.infer<typeof schema>; // this interface is for form data

export interface UserData {
  id: number;
  userName: string;
  email: string;
}

interface Props {
  responseCode: number;
  responseMessage: string;
  data: {
    token: string;
    expiration: string;
    role: [string];
    rights: { rightName: string }[];
    userData: UserData;
  };
}

const Login = () => {
  // const [userName, setUserName] = useState("super_admin");
  // const [password, setPassword] = useState("Rtmes@1122");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({ resolver: zodResolver(schema) });
  const [buttonType, setButtonType] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);

  const createdMessage = "Logged In Successfully!";
  const errorMessage = "Username or Password is not Correct!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  const onSubmit = async (formData: Login) => {
    console.log("Form Data:", formData);
    try {
      setSubmitting(true);
      const response = await apiClient.post<Props>(loginAPI, formData);

      if (response.data.responseCode === 200) {
        console.log("responseCode", response.data.responseCode);
        console.log("responseMessage", response.data.responseMessage);
        console.log("user logged in successfully", response);
        // console.log("token: ", response.data.data.token);
        // const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes from now
        if (Cookies.get("token")) Cookies.remove("token");
        if (Cookies.get("email")) Cookies.remove("email");
        if (Cookies.get("userName")) Cookies.remove("userName");
        if (Cookies.get("userId")) Cookies.remove("userId");
        if (Cookies.get("role")) Cookies.remove("role");
        if (Cookies.get("rights")) Cookies.remove("rights");

        Cookies.set("token", response.data.data.token, {
          expires: new Date(response.data.data.expiration),
        });
        Cookies.set("userName", response.data.data.userData.userName, {
          expires: new Date(response.data.data.expiration),
        });
        Cookies.set("userId", response.data.data.userData.id.toString(), {
          expires: new Date(response.data.data.expiration),
        });
        Cookies.set("email", response.data.data.userData.email, {
          expires: new Date(response.data.data.expiration),
        });
        console.log("role", response.data.data.role);
        if (response.data.data.role.length > 0) {
          Cookies.set("role", response.data.data.role[0], {
            expires: new Date(response.data.data.expiration),
          });
        }
        console.log(
          "rights",
          response.data.data.rights.map((rights) => rights.rightName)
        );
        if (response.data.data.rights.length > 0) {
          Cookies.set(
            "rights",
            JSON.stringify(
              response.data.data.rights.map((rights) => rights.rightName)
            ),
            {
              expires: new Date(response.data.data.expiration),
            }
          );
        }

        window.location.href = "/";
        notifyCreate(createdMessage);
      } else {
        notifyError(response.data.responseMessage);
      }
    } catch (err) {
      setSubmitting(false);
      console.log(err);
      notifyError(
        (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
          errorMessage
      );
    } finally {
      setSubmitting(false); // Always run after try/catch
    }
  };

  return (
    <>
      <video
        autoPlay
        loop
        muted
        style={{
          position: "fixed",
          right: "0",
          bottom: "0",
          minWidth: "100%",
          minHeight: "100%",
          zIndex: "0",
        }}
      >
        <source src={bgVideoNew} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 0,
        }}
      ></div>
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: "1",
        }}
      >
        <div className="row d-flex justify-content-center">
          <div
            className="col-lg-5 col-md-8 col-sm-12 pt-3 ps-5 pe-5 pb-5"
            style={{
              background: "rgba(209, 209, 209, 0.6)",
              position: "fixed",
              padding: "10px",
              borderRadius: "25px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <div className="row">
              <div className="col text-center">
                <Image
                  src={logoNew}
                  className="img-fluid"
                  alt="logo"
                  width={150}
                  height={150}
                />
              </div>
            </div>
            <div className="row">
              <div className="col text-center">
                <h3 className="text-white fw-bold">
                  Directorate General Monitoring & Evaluation
                </h3>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row d-flex justify-content-center mb-3">
                <div className="col-9">
                  <label htmlFor="username" className="form-label text-white">
                    User ID
                  </label>
                  <div className="input-group mb-1">
                    <span
                      className="input-group-text pe-0 bg-white border-0"
                      id="basic-addon1"
                    >
                      <Image
                        src={userGrey}
                        alt="userGrey"
                        width={17}
                        height={17}
                        style={{
                          color: "#7e7e7e !important",
                        }}
                      />
                      <Image
                        src={verticalLineGrey}
                        alt="verticalLineGrey"
                        width={17}
                        height={17}
                      />
                    </span>
                    <input
                      {...register("username")}
                      type="text"
                      className="form-control border-0 bg-white"
                      id="username"
                    />
                  </div>
                  {errors.username && (
                    <ErrorMessage>{errors.username.message}</ErrorMessage>
                  )}
                </div>
              </div>
              <div className="row d-flex justify-content-center">
                <div className="col-9">
                  <label htmlFor="password" className="form-label text-white">
                    Password
                  </label>
                  <div className="input-group mb-1">
                    <span
                      className="input-group-text pe-0 bg-white border-0"
                      id="basic-addon1"
                    >
                      <Image
                        src={passwordGrey}
                        alt="password"
                        width={17}
                        height={17}
                      />
                      <Image
                        src={verticalLineGrey}
                        alt="verticalLineGrey"
                        width={17}
                        height={17}
                      />
                    </span>
                    <input
                      {...register("password")}
                      type={buttonType === true ? "password" : "text"}
                      className="form-control border-0"
                      id="password"
                    />
                    <span
                      className="input-group-text bg-white border-0"
                      id="basic-addon1"
                    >
                      <Button
                        className="btn p-0"
                        type="button"
                        onClick={() => setButtonType(!buttonType)}
                      >
                        <Image src={eye} alt="eye" width={17} height={17} />
                      </Button>
                    </span>
                  </div>
                  {errors.password && (
                    <ErrorMessage>{errors.password.message}</ErrorMessage>
                  )}
                </div>
              </div>
              <div className="row d-flex justify-content-center mb-4 ">
                <div className="col-9 text-end ">
                  <Link
                    className="text-decoration-none"
                    href="/login"
                    style={{ color: "#B1F6FF", fontSize: ".75rem" }}
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <div className="row d-flex flex-colum justify-content-center mb-3">
                <div className="col-9">
                  <Button
                    type="submit"
                    style={{
                      borderRadius: "6px",
                      background: `${
                        isSubmitting
                          ? "linear-gradient(to right, #8cbbde , #6e8799)"
                          : "linear-gradient(to right, #0C8CE9 , #13629B)"
                      }`,
                      letterSpacing: 1,
                    }}
                    className="btn shadow text-white w-100 mb-3 pt-3 pb-3 fw-bold"
                    disabled={isSubmitting}
                  >
                    LOGIN {isSubmitting && <Spinner color="text-light" />}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
