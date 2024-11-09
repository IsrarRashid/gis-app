"use client";
import { Poppins } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { setContent } from "./features/content/contentSlice";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  const currentContent = useSelector(
    (state: RootState) => state.content.currentContent
  );
  const dispatch = useDispatch();

  const handleButtonClick = (content: string) => {
    dispatch(setContent(content));
  };
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role") || "";
    setRole(role);
    if (token) {
      if (role === "Transport Officier") {
        router.push("/dashboardTO");
        handleButtonClick("DashboardTO");
      } else {
        router.push("/dashboard");
        handleButtonClick("Dashboard");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  return <div></div>;
}
