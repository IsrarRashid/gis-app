"use client";
import Image from "next/image";
import arrowLeft from "../../../public/icons/arrow-left.svg";
import arrowRight from "../../../public/icons/arrow-right.svg";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { sort } from "fast-sort";
import TableHeading from "@/app/components/TableHeading";
import { ToastContainer, toast } from "react-toastify";
import { DM_Sans, Inter } from "next/font/google";
import Button from "@/app/components/Button";
import ProgressBar from "@/app/components/ProgressBar";
import downloadLineBlack from "../../../public/icons/downloadLineBlack.svg";
import { MenuProject } from "./MenuModal";
import { singleProjectDashboardAPI } from "@/app/APIs";
import apiClient from "@/app/services/api-client";
import { useRouter } from "next/navigation";
import search2 from "@/public/icons/search2.svg";
import ProjectReportOverviewModal from "./projectReportOverview/ProjectReportOverviewModal";

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
  projectsData: MenuProject[];
  setProjectsData: Dispatch<SetStateAction<MenuProject[] | undefined>>;
  handleClose: () => void;
  label: string;
}

const MenuProjectsTable = ({
  projectsData,
  setProjectsData,
  handleClose,
  label,
}: Props) => {
  const router = useRouter();

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MenuProject;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof MenuProject) => {
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
  const currentData =
    projectsData && projectsData.slice(indexOfFirstRow, indexOfLastRow);

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

  const handleProjectSubmit = async (projectId: number) => {
    try {
      const response = await apiClient.get(
        `${singleProjectDashboardAPI}?projectid=${projectId}`
      );
      if (response.data.data) {
        router.push(`/projectDetailsDashboard/${projectId}`);
        handleClose();
      } else {
        console.log("This Project is not yet Monitored");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<MenuProject[]>([]);
  const [searchEnable, setsearchEnable] = useState(false);

  // Handle search logic
  const handleSearch = () => {
    const lowercasedFilter = searchTerm.toLocaleLowerCase();
    const filtered = projectsData.filter((item) =>
      [
        item.id.toString(),
        item?.gSno?.toString(),
        item.projectName,
        item.sectorName,
        item.districtName,
        item.userName,
      ]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(lowercasedFilter))
    );
    setFilteredData(filtered);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm !== "") {
      setsearchEnable(true);
      handleSearch();
    }
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setsearchEnable(false);
  };

  const getTimeLeft = (deadline: string): string => {
    const now = new Date();
    const targetDate = new Date(deadline);
    const diffInMs = targetDate.getTime() - now.getTime();

    // if (diffInMs <= 0) {
    //   return "Time's up"; // Deadline has passed
    // }

    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} ${days === 1 ? "Day" : "Days"} Left`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? "Hour" : "Hours"} Left`;
    } else {
      return `${minutes} ${minutes === 1 ? "Minute" : "Minutes"} Left`;
    }
  };

  // const [timeLeft, setTimeLeft] = useState<string>("");

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimeLeft(getTimeLeft(d.completedDate));
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [d.completedDate]);

  // const remainingTime = (menuProject: MenuProject) => {
  //   const timeLeft = getTimeLeft(menuProject.completedDate);
  //   timeLeft.inclu
  // };

  return (
    <>
      <>
        <div className="col text-center text-white rounded bg-color-sea-blue">
          <div className="row d-flex">
            <div className="col d-none d-md-block"></div>
            <div className="col" style={{ marginTop: "10px" }}>
              <p className="m-0 fs12px fw-bold" style={{ letterSpacing: 1 }}>
                {label && label} Projects
              </p>
            </div>
            <div className="col text-end mt-1 mb-1 me-2">
              <Button
                className="btn btn-sm btn-light"
                style={{ whiteSpace: "nowrap" }}
              >
                Downloads &nbsp;
                <Image
                  src={downloadLineBlack}
                  alt="download"
                  width={12}
                  height={15}
                />
              </Button>
            </div>
          </div>
        </div>
        <div className="row d-flex justify-content-between p-3">
          <div className="col-lg-6 col-md-5 col-sm-12">
            <p>
              Showing:{" "}
              <span className="fw-bold">
                {searchEnable ? filteredData.length : projectsData?.length}{" "}
                Projects
              </span>
            </p>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <form onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <span
                  className="input-group-text pe-0 border-0 rounded-end rounded-pill"
                  id="basic-addon1"
                  style={{ background: "#c6def5" }}
                >
                  <Image src={search2} alt="search2" width={20} height={20} />
                </span>
                <input
                  type="text"
                  className="form-control border-0 rounded-start"
                  style={{ background: "rgba(16, 143, 168, .1)" }}
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleChange}
                />
                <button
                  className="btn rounded-start rounded-pill bg-color-sea-green text-white"
                  type="submit"
                >
                  Search
                </button>
              </div>
            </form>
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
              <TableHeading
                name="gS no"
                handleSort={() => handleSort("gSno")}
              />
              <TableHeading
                name="project Name"
                handleSort={() => handleSort("projectName")}
              />
              <TableHeading
                name="district Name"
                handleSort={() => handleSort("districtName")}
              />
              <TableHeading
                name="sector Name"
                handleSort={() => handleSort("sectorName")}
              />
              <TableHeading
                name="user Name"
                handleSort={() => handleSort("userName")}
              />
              <TableHeading
                name="report Completion"
                handleSort={() => handleSort("reportCompletion")}
              />
              <TableHeading
                name="completed Date"
                handleSort={() => handleSort("completedDate")}
              />

              <th>report</th>
            </tr>
          </thead>
          <tbody>
            {(searchEnable ? filteredData : paginatedData).map((d) => (
              <tr
                key={d.id}
                className={dmSans.className}
                style={{
                  border: ".41px solid rgba(81,81,81,0.20) !important",
                  fontSize: ".85rem",
                }}
              >
                <td>{d.id}</td>
                <td
                  onClick={() => handleProjectSubmit(d.id)}
                  className="text-wrap cursor-pointer"
                >
                  {d.projectName}
                </td>
                <td>{d.districtName}</td>
                <td>{d.sectorName}</td>
                <td>{d.userName}</td>
                <td>
                  <ProgressBar value={Math.round(d.reportCompletion)} />
                </td>
                <td
                  className={`text-wrap ${
                    getTimeLeft(d.completedDate).includes("-")
                      ? "text-danger"
                      : ""
                  }`}
                >
                  {getTimeLeft(d.completedDate)}
                </td>
                <td>
                  <ProjectReportOverviewModal />
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

export default MenuProjectsTable;
