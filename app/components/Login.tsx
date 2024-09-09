"use client";
import { FormEvent, useState } from "react";
import Cookies from "js-cookie";
import bgVideo from "../../public/video/bg-video.mp4";
import logoGreen from "../../public/images/logo-green.png";
import user from "../../public/icons/user-2.svg";
import Image from "next/image";
import { useDispatch } from "react-redux";
import apiClient, { AxiosError } from "../services/api-client";
import { loginAPI } from "../APIs";
import { ToastContainer, toast } from "react-toastify";

export interface UserData {
  userName: string;
  email: string;
}

interface Props {
  data: {
    token: string;
    expiration: string;
    userData: UserData;
  };
}

const Login = () => {
  const [userName, setUserName] = useState("shahid");
  const [password, setPassword] = useState("Home@5790");

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
      localStorage.setItem("token", response.data.data.token);
      window.location.href = "/";
      notifyCreate(createdMessage);
    } catch (err) {
      console.log((err as AxiosError).message);
      notifyError(errorMessage);
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
        }}
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      <div className="container">
        <div className="row d-flex justify-content-center">
          <div
            className="col-3 pt-3 ps-5 pe-5 pb-5 mt-5"
            style={{
              background: "rgba(209, 209, 209, 0.6)",
              position: "fixed",
              border: "2px solid #fff",
              padding: "10px",
              borderRadius: "25px",
            }}
          >
            <div className="row">
              <div className="col text-center">
                <Image src={logoGreen} className="img-fluid" alt="logo" />
              </div>
            </div>
            <div className="row">
              <div className="col text-center">
                <h3 className=" text-white">
                  Directorate General Monitoring & Evaluation
                </h3>
              </div>
            </div>
            <form onSubmit={handleSumbit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label text-white">
                  User ID
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-white" id="basic-addon1">
                    <Image src={user} alt="user" />
                  </span>
                  <input
                    style={{
                      borderLeft: "2px solid #c7c7c7",
                    }}
                    type="text"
                    className="form-control"
                    id="username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label text-white">
                  Password
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-white" id="basic-addon1">
                    <Image src={user} alt="user" />
                  </span>
                  <input
                    style={{
                      borderLeft: "2px solid #c7c7c7",
                    }}
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{
                  borderRadius: "6px",
                }}
                className="btn btn-success text-white w-100 mb-3 pt-3 pb-3"
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
