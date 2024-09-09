"use client";
import React, { useEffect, useState } from "react";
import ProjectForm from "./ProjectForm";
import { projectAPI } from "@/app/APIs";
import { getFormattedDate } from "@/app/utils";
import useProjects, { Project } from "@/app/hooks/useProjects";

interface ForForm {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopMenu = ({ refresh, setRefresh }: ForForm) => {
  const { data, setData } = useProjects({ refresh });
  const [originalData, setOriginalData] = useState<Project[]>([]); // Store the original data

  useEffect(() => {
    setOriginalData(data);
  }, [refresh, data]);

  const hideCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setData((prevData) =>
        prevData.filter((item) => item.status !== "Complete")
      );
    } else {
      setData(originalData); // Reset to original data
    }
  };

  const showCancel = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setData((prevData) =>
        prevData.filter((item) => item.status === "Cancel")
      );
    } else {
      setData(originalData); // Reset to original data
    }
  };

  return (
    <>
      <div className="row d-flex p-3">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h4 className="fw-bold">Projects</h4>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="row d-flex ">
            <div className="col d-none d-lg-block"></div>
            <div className="col text-end">
              <span className="fw-bold">{getFormattedDate()}</span> Today
            </div>
            <div className="col text-end">
              <ProjectForm
                api={projectAPI}
                method="POST"
                setRefresh={setRefresh}
                refresh={refresh}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row p-3">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <p>
            Showing: <span className="fw-bold">{data?.length} Projects</span>
          </p>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="row d-flex justify-content-end align-items-center">
            <div className="col-lg-4 col-md-4 col-sm-12 text-center">
              <input
                type="checkbox"
                className="form-check-input"
                onChange={hideCompleted}
              />
              <label htmlFor="">&nbsp;Hide Completed</label>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 text-center">
              <input
                type="checkbox"
                className="form-check-input"
                onChange={showCancel}
              />
              <label htmlFor="">&nbsp;Show Cancel</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopMenu;
