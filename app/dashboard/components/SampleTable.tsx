"use client";
import Image from "next/image";
import calender from "../../../public/icons/calendar.svg";
import clock from "../../../public/icons/clock.svg";
import cancel from "../../../public/icons/cancel.svg";
import complete from "../../../public/icons/complete.svg";
import arrowLeft from "../../../public/icons/arrow-left.svg";
import arrowRight from "../../../public/icons/arrow-right.svg";
import { useEffect, useState } from "react";
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

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({ subsets: ["latin"] });

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Option {
  id: number;
  name: string;
}

const SampleTable = ({ refresh, setRefresh }: ListProps) => {
  const { data, setData, error, setError, isLoading } = useProjects({
    refresh,
  });
  const { data: sectorsData } = useSectors({ refresh });
  const { data: attributeGroups } = useAttributeGroups({ refresh });
  const [originalData, setOriginalData] = useState<Project[]>([]); // Store the original data

  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Project;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Project) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    const sortedData = sort(data)[direction](key);
    setSortConfig({ key, direction });
    setData([...sortedData]);
  };

  useEffect(() => {
    setOriginalData(data);
  }, [refresh, data]);

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${projectAPI}/${id}`);
      // remove the deleted item from the data array
      setData((prevData) => prevData.filter((item) => item.id !== id));
      notifyCreate(deleteMessage);
      console.log("item deleted successfully");
    } catch (err) {
      console.error("failed to delete item", err);
      setError((err as AxiosError).message);
      notifyError((err as AxiosError).message);
    }
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
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

  // for pagination buttons
  const totalPages = Math.ceil(data.length / rows);
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
  const paginatedData = data.slice(
    (currentPage - 1) * rows,
    currentPage * rows
  );
  const hideCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Filter the data to hide completed items
      setData((prevData) =>
        prevData.filter((item) => item.status !== "Complete")
      );
    } else {
      // Reset to the original data
      setData([...originalData]);
    }
  };

  const showCancel = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Filter the data to show only canceled items
      setData((prevData) =>
        prevData.filter((item) => item.status === "Cancel")
      );
    } else {
      // Reset to the original data
      setData([...originalData]);
    }
  };

  const getName = (id: number, data: Sector[]) => {
    const sector = data.find((sector) => sector.id === id);
    return sector?.name;
  };

  return (
    <>
      <>
        {/* <div className="row d-flex p-3">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h4 className="fw-bold">Projects</h4>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="row d-flex ">
              <div className="col d-none d-lg-block"></div>
              <div className="col text-end">
                <span className="fw-bold">
                  {getFormattedDate(new Date(), "short")}
                </span>{" "}
                Today
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
        </div> */}
        <div className="row p-2">
          {/* {isLoading && (
            <div className="col text-center">
              <div className="spinner-border text-primary"></div>
            </div>
          )} */}

          {/* <div className="col-lg-6 col-md-6 col-sm-12">
            <p>
              Showing: <span className="fw-bold">{data?.length} Projects</span>
            </p>
          </div> */}
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
              <th>ID</th>
              <th>GSNO</th>
              <th>NAME</th>
              <th>DISTRICT</th>
              <th>COST</th>
              <th style={{ whiteSpace: "nowrap" }}>TOTAL EXPENDITURE</th>
              <th style={{ whiteSpace: "nowrap" }}>ACTUAL EXPENDITURE</th>
              <th style={{ whiteSpace: "nowrap" }}>PLANNED PROGRESS</th>
              <th style={{ whiteSpace: "nowrap" }}>PHYSICAL PROGRESS</th>
              <th style={{ whiteSpace: "nowrap" }}>PROGRESS STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr
              className={dmSans.className}
              style={{
                border: ".41px solid rgba(81,81,81,0.20) !important",
                fontSize: ".85rem",
              }}
            >
              <td>0</td>
              <td>1</td>
              <td>
                Construction of Cadet Hostels and Other Facilities at Cadet
                College Okara
              </td>
              <td>Okara</td>
              <td>96.4 M</td>
              <td>71.4 M</td>
              <td>53.3 M</td>
              <td>
                <div
                  className="progress rounded rounded-pill mt-2"
                  style={{ height: "10px" }}
                >
                  <motion.div
                    className="progress-bar rounded rounded-pill"
                    style={{
                      width: "75%",
                      backgroundImage:
                        "linear-gradient(to right, #0C8CE9 , #1A67A0)",
                    }}
                    role="progressbar"
                    aria-valuenow={75}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    initial={{ width: "0%" }}
                    whileInView={{ width: "75%" }}
                    transition={{
                      duration: 1,
                      ease: "easeIn",
                    }}
                  ></motion.div>
                </div>
              </td>
              <td>
                <div className="row">
                  <div className="col-9">
                    <div
                      className="progress rounded rounded-pill mt-2"
                      style={{ height: "10px" }}
                    >
                      <motion.div
                        className="progress-bar rounded rounded-pill"
                        style={{
                          width: "75%",
                          backgroundImage:
                            "linear-gradient(to right, #0C8CE9 , #1A67A0)",
                        }}
                        role="progressbar"
                        aria-valuenow={62}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "62%" }}
                        transition={{
                          duration: 1,
                          ease: "easeIn",
                        }}
                      ></motion.div>
                    </div>
                  </div>
                  <div className="col-1 p-0">
                    <span className="text-white">62%</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="text-center">65%</div>
              </td>
            </tr>
            <tr
              className={dmSans.className}
              style={{
                border: ".41px solid rgba(81,81,81,0.20) !important",
                fontSize: ".85rem",
              }}
            >
              <td>1</td>
              <td>2</td>
              <td>
                Construction of Cadet Hostels and Other Facilities at Cadet
                College Okara
              </td>
              <td>Okara</td>
              <td>96.4 M</td>
              <td>71.4 M</td>
              <td>53.3 M</td>
              <td>
                <div
                  className="progress rounded rounded-pill mt-2"
                  style={{ height: "10px" }}
                >
                  <motion.div
                    className="progress-bar rounded rounded-pill"
                    style={{
                      width: "40%",
                      backgroundImage:
                        "linear-gradient(to right, #0C8CE9 , #1A67A0)",
                    }}
                    role="progressbar"
                    aria-valuenow={40}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    initial={{ width: "0%" }}
                    whileInView={{ width: "40%" }}
                    transition={{
                      duration: 1,
                      ease: "easeIn",
                    }}
                  ></motion.div>
                </div>
              </td>
              <td>
                <div className="row">
                  <div className="col-9">
                    <div
                      className="progress rounded rounded-pill mt-2"
                      style={{ height: "10px" }}
                    >
                      <motion.div
                        className="progress-bar rounded rounded-pill"
                        style={{
                          width: "40%",
                          backgroundImage:
                            "linear-gradient(to right, #0C8CE9 , #1A67A0)",
                        }}
                        role="progressbar"
                        aria-valuenow={40}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "40%" }}
                        transition={{
                          duration: 1,
                          ease: "easeIn",
                        }}
                      ></motion.div>
                    </div>
                  </div>
                  <div className="col-1 p-0">
                    <span className="text-white">40%</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="text-center">35%</div>
              </td>
            </tr>
            <tr
              className={dmSans.className}
              style={{
                border: ".41px solid rgba(81,81,81,0.20) !important",
                fontSize: ".85rem",
              }}
            >
              <td>2</td>
              <td>3</td>
              <td>
                Construction of Cadet Hostels and Other Facilities at Cadet
                College Okara
              </td>
              <td>Okara</td>
              <td>96.4 M</td>
              <td>71.4 M</td>
              <td>53.3 M</td>
              <td>
                <div
                  className="progress rounded rounded-pill mt-2"
                  style={{ height: "10px" }}
                >
                  <motion.div
                    className="progress-bar rounded rounded-pill"
                    style={{
                      width: "15%",
                      backgroundImage:
                        "linear-gradient(to right, #0C8CE9 , #1A67A0)",
                    }}
                    role="progressbar"
                    aria-valuenow={15}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    initial={{ width: "0%" }}
                    whileInView={{ width: "15%" }}
                    transition={{
                      duration: 1,
                      ease: "easeIn",
                    }}
                  ></motion.div>
                </div>
              </td>
              <td>
                <div className="row">
                  <div className="col-9">
                    <div
                      className="progress rounded rounded-pill mt-2"
                      style={{ height: "10px" }}
                    >
                      <motion.div
                        className="progress-bar rounded rounded-pill"
                        style={{
                          width: "15%",
                          backgroundImage:
                            "linear-gradient(to right, #0C8CE9 , #1A67A0)",
                        }}
                        role="progressbar"
                        aria-valuenow={15}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "15%" }}
                        transition={{
                          duration: 1,
                          ease: "easeIn",
                        }}
                      ></motion.div>
                    </div>
                  </div>
                  <div className="col-1 p-0">
                    <span className="text-white">15%</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="text-center">15%</div>
              </td>
            </tr>
            <tr
              className={dmSans.className}
              style={{
                border: ".41px solid rgba(81,81,81,0.20) !important",
                fontSize: ".85rem",
              }}
            >
              <td>3</td>
              <td>4</td>
              <td>
                Construction of Cadet Hostels and Other Facilities at Cadet
                College Okara
              </td>
              <td>Okara</td>
              <td>96.4 M</td>
              <td>71.4 M</td>
              <td>53.3 M</td>
              <td>
                <div
                  className="progress rounded rounded-pill mt-2"
                  style={{ height: "10px" }}
                >
                  <motion.div
                    className="progress-bar rounded rounded-pill"
                    style={{
                      width: "90%",
                      backgroundImage:
                        "linear-gradient(to right, #0C8CE9 , #1A67A0)",
                    }}
                    role="progressbar"
                    aria-valuenow={90}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    initial={{ width: "0%" }}
                    whileInView={{ width: "90%" }}
                    transition={{
                      duration: 1,
                      ease: "easeIn",
                    }}
                  ></motion.div>
                </div>
              </td>
              <td>
                <div className="row">
                  <div className="col-9">
                    <div
                      className="progress rounded rounded-pill mt-2"
                      style={{ height: "10px" }}
                    >
                      <motion.div
                        className="progress-bar rounded rounded-pill"
                        style={{
                          width: "95%",
                          backgroundImage:
                            "linear-gradient(to right, #0C8CE9 , #1A67A0)",
                        }}
                        role="progressbar"
                        aria-valuenow={95}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "95%" }}
                        transition={{
                          duration: 1,
                          ease: "easeIn",
                        }}
                      ></motion.div>
                    </div>
                  </div>
                  <div className="col-1 p-0">
                    <span className="text-white">95%</span>
                  </div>
                </div>
              </td>
              <td>
                <div className="text-center">25%</div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="row d-flex mb-3">
          <div className="col-lg-6 col-md-3 col-sm-12 mt-2">
            <div className="row d-flex">
              <div className="col-lg-2 col-md-8">
                {/* Display the current range and total */}
                {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, data.length)}{" "}
                of {data.length}
              </div>

              <div className="col">
                <p>
                  Showing:{" "}
                  <span className="fw-bold">{data?.length} Projects</span>
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
                <button
                  className="btn btn-sm bg-color-sea-blue shadow me-2"
                  style={{ border: "1px solid #1580CF" }}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <Image src={arrowLeft} alt="arrow left" />
                </button>
                <button
                  className="btn btn-sm bg-color-sea-blue shadow"
                  style={{ border: "1px solid #1580CF" }}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <Image src={arrowRight} alt="arrow right" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default SampleTable;
