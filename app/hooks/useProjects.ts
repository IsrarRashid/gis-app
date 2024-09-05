import { useEffect, useState } from "react";
import projectService, { Project } from "../services/project-service";
import { CanceledError } from "../services/api-client";

const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = projectService.getAll<Project>();
    request
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, []);

  return { projects, error, isLoading, setProjects, setError };
};

export default useProjects;
