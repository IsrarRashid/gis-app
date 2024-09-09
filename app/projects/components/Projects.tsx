import { useEffect, useState } from "react";
import ProjectsList from "./ProjectsList";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Projects = () => {
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token")
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="row p-3">
      <ProjectsList refresh={refresh} setRefresh={setRefresh} />
    </div>
  );
};

export default Projects;
