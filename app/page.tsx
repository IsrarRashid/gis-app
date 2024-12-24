"use client";
import Cookies from "js-cookie";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setContent } from "./features/content/contentSlice";
import { RootState } from "./store";

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
    const rights = JSON.parse(Cookies.get("rights") || "[]");
    let hasDashboard = false;
    if (!token) return router.push("/login");

    if (rights.length > 0) {
      for (let i = 0; i < rights.length; i++) {
        if (rights[i].toLowerCase() === "dashboard") {
          router.push(`/${rights[i]}`);
          hasDashboard = true;
          break;
        } else if (
          rights[i].toLowerCase().startsWith("dashboard") &&
          rights[i].toLowerCase() !== "project-details-dashboard"
        ) {
          router.push(`/${rights[i]}`);
          hasDashboard = true;
          break;
        }
      }
      if (!hasDashboard) router.push(`/${rights[0]}`);
    } else {
      router.push("/not-authorized");
    }
  }, [router]);

  return <div></div>;
}
