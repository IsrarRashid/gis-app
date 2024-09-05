"use client";

import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import bgVideo from "../../public/video/bg-video.mp4";
import logoGreen from "../../public/images/logo-green.png";
import user from "../../public/icons/user-2.svg";
import password from "../../public/icons/password.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

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
  const postRoute = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/Authentication/login`;
  const [userName, setUserName] = useState("shahid");
  const [password, setPassword] = useState("Home@5790");

  const router = useRouter();

  const dispatch = useDispatch();

  const handleSumbit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<Props>(postRoute, {
        userName,
        password,
      });
      console.log("user logged in successfully", response);
      console.log("token: ", response.data.data.token);
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
      router.push("/");
    } catch (error) {
      console.log("Error fetching data:", error);
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

      <div className="container d-flex justify-content-center mt-5">
        <div
          className="col-4 mt-5 pt-3 ps-5 pe-5 pb-5"
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
      {/* <div
      className={"container p-3 mt-3 mb-4"}
      style={{
        background: "rgba(209, 209, 209, 0.4)",

        border: "2px solid #fff",
        padding: "10px",
        borderRadius: "25px",
      }}
    >
      <h3 className="fw-bold text-center text-white">Login Page</h3>
      <div
        className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
        style={{
          backgroundImage: "linear-gradient(to left, #969696 ,#e3e3e3 )",
          borderRadius: "20px",
        }}
      >
        <form onSubmit={handleSumbit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              User Name
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div> */}
    </>
  );
};

export default Login;
