"use client";
import Image from "next/image";
import calender from "../../../public/icons/calendar.svg";
import clock from "../../../public/icons/clock.svg";
import cancel from "../../../public/icons/cancel.svg";
import complete from "../../../public/icons/complete.svg";
import arrowLeft from "../../../public/icons/arrow-left.svg";
import arrowRight from "../../../public/icons/arrow-right.svg";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DeleteModal from "@/app/components/DeleteModal";
import { projectAPI } from "@/app/APIs";
import { sort } from "fast-sort";
import TableHeading from "@/app/components/TableHeading";
import { getFormattedDate } from "@/app/utils";
import useProjects, { Project } from "@/app/hooks/useProjects";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { ToastContainer, toast } from "react-toastify";
import useSectors, { Sector } from "@/app/hooks/useSectors";
import useAttributeGroups from "@/app/hooks/useAttributeGroups";
import { DM_Sans, Inter } from "next/font/google";
import ProjectForm from "@/app/projects/components/ProjectForm";
import { motion } from "framer-motion";
import Button from "@/app/components/Button";
import { ProjectsList } from "./Dashboard";
import ProgressBar from "@/app/components/ProgressBar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({ subsets: ["latin"] });

export interface Option {
  id: number;
  name: string;
}

interface Props {
  projectsData: ProjectsList[];
  setProjectsData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
}

const ProjectsTable = ({ projectsData, setProjectsData }: Props) => {
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ProjectsList;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof ProjectsList) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    const sortedData = sort(projectsData)[direction](key);
    setSortConfig({ key, direction });
    setProjectsData([...sortedData]);
  };

  // for selecting rows per page
  const [rows, setRows] = useState(10); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  const handleRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRows(parseInt(e?.target.value, 10));
    setCurrentPage(1);
  };

  // Determine the data to display for the current page
  const indexOfLastRow = currentPage * rows;
  const indexOfFirstRow = indexOfLastRow - rows;
  const currentData = projectsData.slice(indexOfFirstRow, indexOfLastRow);

  // for pagination buttons
  const totalPages = Math.ceil(projectsData.length / rows);
  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Paginate data to display only the current page's rows
  const paginatedData = projectsData.slice(
    (currentPage - 1) * rows,
    currentPage * rows
  );

  // const columns =
  //   projectsData.length > 0
  //     ? Object.keys(projectsData[0]).filter(
  //         (column) => column !== "latitude" && column !== "longitude"
  //       )
  //     : [];

  return (
    <>
      <>
        <div className="row p-2">
          {/* {isLoading && (
            <div className="col text-center">
              <div className="spinner-border text-primary"></div>
            </div>
          )} */}
          <div className="col-lg-6 col-md-6 col-sm-12">
            {/* <div className="row d-flex justify-content-end align-items-center">
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
            </div> */}
          </div>
        </div>
      </>
      <div className="table-responsive">
        <table
          className="table mb-5 "
          style={{ border: ".41px solid rgba(159, 159, 159, 0.75) !important" }}
        >
          <thead>
            <tr
              className={`color-dark-blue cursor-pointer ${inter.className}`}
              style={{
                border: ".41px solid rgba(159, 159, 159, 0.75) !important",
                fontSize: ".85rem",
              }}
            >
              <TableHeading name="id" handleSort={() => handleSort("id")} />
              <TableHeading
                name="gS no"
                handleSort={() => handleSort("gSno")}
              />
              <TableHeading
                name="project Name"
                handleSort={() => handleSort("projectName")}
              />
              <TableHeading
                name="sector Name"
                handleSort={() => handleSort("sectorName")}
              />
              <TableHeading
                name="district Name"
                handleSort={() => handleSort("districtName")}
              />
              <TableHeading
                name="district Id"
                handleSort={() => handleSort("districtId")}
              />
              <TableHeading
                name="total Expenditure"
                handleSort={() => handleSort("totalExpenditure")}
              />
              <TableHeading
                name="actual Expenditure"
                handleSort={() => handleSort("actualExpenditure")}
              />
              <TableHeading
                name="planned Progress"
                handleSort={() => handleSort("plannedProgress")}
              />
              <TableHeading
                name="physical Progress"
                handleSort={() => handleSort("physicalProgress")}
              />
              <TableHeading
                name="financal Progress"
                handleSort={() => handleSort("financalProgress")}
              />
            </tr>
          </thead>
          <tbody>
            {currentData.map((d) => (
              <tr
                key={d.id}
                className={dmSans.className}
                style={{
                  border: ".41px solid rgba(81,81,81,0.20) !important",
                  fontSize: ".85rem",
                }}
              >
                <td>{d.id}</td>
                <td>{d.gSno}</td>
                <td>{d.projectName}</td>
                <td>{d.sectorName}</td>
                <td>{d.districtName}</td>
                <td>{d.districtId}</td>
                <td>{d.totalExpenditure}</td>
                <td>{d.actualExpenditure}</td>
                <td>
                  <ProgressBar value={Math.round(d.plannedProgress)} />
                </td>
                <td>
                  <ProgressBar value={Math.round(d.physicalProgress)} />
                </td>
                <td>
                  <ProgressBar value={Math.round(d.financalProgress)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row d-flex mb-3">
          <div className="col-lg-6 col-md-3 col-sm-12 mt-2">
            <div className="row d-flex">
              <div className="col-lg-2 col-md-8">
                {/* Display the current range and total */}
                {indexOfFirstRow + 1} -{" "}
                {Math.min(indexOfLastRow, projectsData.length)} of{" "}
                {projectsData.length}
              </div>

              <div className="col">
                <p>
                  Showing:{" "}
                  <span className="fw-bold">
                    {projectsData?.length} Projects
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-9 col">
            <div className="row d-flex justify-content-end">
              <div className="col-lg-2 col-md-1 col"></div>
              <div className="col-lg-5 col-md-4 col text-end">
                <label htmlFor="rowPerPage" className="form-label mt-1">
                  Rows Per Page:
                </label>
              </div>
              <div className="col-lg-1 col-md-3 col text-start p-0">
                <select
                  className="rounded bg-color-sea-blue text-white shadow p-1"
                  style={{
                    color: "#fff",
                    border: "1px solid #1580CF",
                    outline: "none",
                  }}
                  aria-label="Rows per page"
                  name="rowPerPage"
                  value={rows}
                  onChange={handleRowsPerPage}
                >
                  {[10, 20, 30, 40, 50].map((num) => (
                    <option key={num} value={num}>
                      &nbsp;{num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-12 text-end">
                <Button
                  className="btn btn-sm bg-color-sea-blue shadow me-2"
                  style={{ border: "1px solid #1580CF" }}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <Image src={arrowLeft} alt="arrow left" />
                </Button>
                <Button
                  className="btn btn-sm bg-color-sea-blue shadow"
                  style={{ border: "1px solid #1580CF" }}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <Image src={arrowRight} alt="arrow right" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default ProjectsTable;
