"use client";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  // const currentContent = useSelector(
  //   (state: RootState) => state.content.currentContent
  // );
  // const dispatch = useDispatch();

  // const handleButtonClick = (content: string) => {
  //   dispatch(setContent(content));
  // };

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = searchParams.toString();

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const rights = JSON.parse(Cookies.get("rights") || "[]");
    let hasDashboard = false;
    if (!token) return router.push("/login");

    if (rights.length > 0) {
      if (!hasDashboard) {
        for (let i = 0; i < rights.length; i++) {
          if (
            rights[i].toLowerCase() === "dashboard-dg" &&
            role?.toLowerCase() === "director general"
          ) {
            router.push(
              `/${rights[i]}${currentParams ? `?${currentParams}` : ""}`
            );
            hasDashboard = true;
            break;
          }
        }
      }
      if (!hasDashboard) {
        for (let i = 0; i < rights.length; i++) {
          if (rights[i].toLowerCase() === "dashboard") {
            router.push(
              `/${rights[i]}${currentParams ? `?${currentParams}` : ""}`
            );
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
      }

      if (!hasDashboard)
        router.push(`/${rights[0]}${currentParams ? `?${currentParams}` : ""}`);
    } else {
      router.push("/not-authorized");
    }
  }, [router]);

  return <div></div>;
}
