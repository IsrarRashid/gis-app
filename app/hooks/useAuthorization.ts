import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const useAuthorization = (requiredRight: string) => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const rights = JSON.parse(Cookies.get("rights") || "[]");
    if (!rights.includes(requiredRight)) {
      router.push(rights.length > 0 ? `/${rights[0]}` : "/notAuthorized");
    }
  }, [router, requiredRight]);
};

export default useAuthorization;
