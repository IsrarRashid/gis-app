import { useEffect, useState } from "react";
import ProjectsList from "./ProjectsList";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Projects = () => {
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div
      className={"container p-3 mt-3 mb-4"}
      style={{
        background: "rgba(209, 209, 209, 0.4)",
        border: "1px solid #ededed",
        padding: "10px",
        borderRadius: "15px",
      }}
    >
      <div className="row p-3">
        <ProjectsList refresh={refresh} setRefresh={setRefresh} />
      </div>
    </div>
  );
};

export default Projects;
