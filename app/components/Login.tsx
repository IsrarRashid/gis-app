"use client";
import { FormEvent, useState } from "react";
import Cookies from "js-cookie";
import bgVideo from "../../public/video/bg-video.mp4";
import logoNew from "../../public/icons/logoNew.svg";
import userGrey from "../../public/icons/userGrey.svg";
import passwordGrey from "../../public/icons/passwordGrey.svg";
import eye from "../../public/icons/eye.svg";
import verticalLineGrey from "../../public/icons/verticalLineGrey.svg";
import Image from "next/image";
import { useDispatch } from "react-redux";
import apiClient, { AxiosError } from "../services/api-client";
import { loginAPI } from "../APIs";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import Button from "./Button";

export interface UserData {
  userName: string;
  email: string;
}

export interface Right {
  rightId: number;
  rightName: string;
  rightIdentifier: string;
}

interface Props {
  data: {
    token: string;
    expiration: string;
    role: [string];
    rights: Right[];
    userData: UserData;
  };
}

const Login = () => {
  const [userName, setUserName] = useState("shahid");
  const [password, setPassword] = useState("Home@5790");
  const [buttonType, setButtonType] = useState(true);

  const dispatch = useDispatch();

  const createdMessage = "Logged In Successfully!";
  const errorMessage = "Username or Password is not Correct!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  const handleSumbit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await apiClient.post<Props>(loginAPI, {
        userName,
        password,
      });
      console.log("user logged in successfully", response);
      // console.log("token: ", response.data.data.token);
      // const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes from now
      Cookies.set("token", response.data.data.token, {
        expires: new Date(response.data.data.expiration),
      });
      Cookies.set("userName", response.data.data.userData.userName, {
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
      console.log("rights", JSON.stringify(response.data.data.rights));
      if (response.data.data.rights.length > 0) {
        Cookies.set("rights", JSON.stringify(response.data.data.rights), {
          expires: new Date(response.data.data.expiration),
        });
      }

      // localStorage.setItem("token", response.data.data.token);
      window.location.href = "/";
      notifyCreate(createdMessage);
    } catch (err) {
      console.log((err as AxiosError).message);
      // notifyError(errorMessage);
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
        <source src={bgVideo} type="video/mp4" />
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
            <form onSubmit={handleSumbit}>
              <div className="row d-flex justify-content-center mb-3">
                <div className="col-9">
                  <label htmlFor="username" className="form-label text-white">
                    User ID
                  </label>
                  <div className="input-group mb-3">
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
                      type="text"
                      className="form-control border-0 bg-white"
                      id="username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="row d-flex justify-content-center">
                <div className="col-9">
                  <label htmlFor="password" className="form-label text-white">
                    Password
                  </label>
                  <div className="input-group mb-3">
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
                      type={buttonType === true ? "password" : "text"}
                      className="form-control border-0"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      background:
                        "linear-gradient(to right, #0C8CE9 , #13629B)",
                      letterSpacing: 1,
                    }}
                    className="btn shadow text-white w-100 mb-3 pt-3 pb-3 fw-bold"
                  >
                    LOGIN
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
