"use client";
import { mainDashboardAPI } from "../APIs";
import useLazyFetch from "../hooks/useLazyFetch";

const ProjectDetailsDashboard = () => {
  const { data, error, isLoading, fetchData } = useLazyFetch<any>();
  const formData = {
    id: 40,
    parentId: 0,
    name: "test updated",
    description: "",
    createdAt: "",
    updateAt: "",
    sortId: 8,
  };
  const handleFetch = () => {
    fetchData({
      endpoint: `${mainDashboardAPI}`,
      method: "POST",
      body: [
        {
          filterIdentifier: "",
          filterValues: "",
        },
      ],
    });
  };

  return (
    <div>
      <button onClick={handleFetch} disabled={isLoading}>
        {isLoading ? "Loading..." : "Fetch Data"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default ProjectDetailsDashboard;
