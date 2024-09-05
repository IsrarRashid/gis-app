"use client";
import Image from "next/image";
import calender from "../../../public/icons/calendar.svg";
import clock from "../../../public/icons/clock.svg";
import cancel from "../../../public/icons/cancel.svg";
import complete from "../../../public/icons/complete.svg";
import arrowLeft from "../../../public/icons/arrow-left.svg";
import arrowRight from "../../../public/icons/arrow-right.svg";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import DeleteModal from "@/app/components/DeleteModal";
import { projectAPI } from "@/app/APIs";
import ProjectForm from "./ProjectForm";
import { sort } from "fast-sort";
import TableHeading from "@/app/sectors/components/TableHeading";
import { getFormattedDate } from "@/app/utils";

interface Props {
  id: number;
  sectorId: number;
  name: string;
  address: string;
  city: string;
  locationCoordinates: string;
  status: string;
  sectorName: string;
  groups: string;
}

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectsList = ({ refresh, setRefresh }: ListProps) => {
  const [data, setData] = useState<Props[]>([]);
  const [originalData, setOriginalData] = useState<Props[]>([]); // Store the original data

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Props;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Props) => {
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
    const loadItems = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const response = await axios.get(projectAPI, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setData(response.data.data);
          setOriginalData(response.data.data);
        }
        console.log("api Data:", data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    loadItems();
  }, [refresh]);

  useEffect(() => {
    console.log("new data:", data);
  }, [data]);

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get("token");
      if (token) {
        await axios.delete(`${projectAPI}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        // remove the deleted item from the data array
        setData((prevData) => prevData.filter((item) => item.id !== id));
        // notifyCreate(deleteMessage);
        console.log("item deleted successfully");
      }
    } catch (error) {
      console.error("failed to delete item", error);
      // notifyError(errorMessage);
    }
  };

  // for selecting rows per page
  const [rows, setRows] = useState(11); // Default to 11 rows per page
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

  return (
    <>
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
      <div className="table-responsive ">
        <table className="table mb-5" style={{ border: ".5px solid #858585" }}>
          <thead>
            <tr
              className="color-dark-blue cursor-pointer"
              style={{ border: "1px solid #858585 !important" }}
            >
              <TableHeading name="id" handleSort={() => handleSort("id")} />
              <TableHeading name="name" handleSort={() => handleSort("name")} />
              <TableHeading
                name="sector Id"
                handleSort={() => handleSort("sectorId")}
              />
              <TableHeading
                name="address"
                handleSort={() => handleSort("address")}
              />
              <TableHeading name="city" handleSort={() => handleSort("city")} />
              <TableHeading
                name="location coordinates"
                handleSort={() => handleSort("locationCoordinates")}
              />
              <TableHeading
                name="status"
                handleSort={() => handleSort("status")}
              />
              <TableHeading
                name="sector name"
                handleSort={() => handleSort("sectorName")}
              />
              <TableHeading
                name="groups"
                handleSort={() => handleSort("groups")}
              />
              <th colSpan={2}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentData?.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.sectorId}</td>
                <td>{d.address}</td>
                <td>{d.city}</td>
                <td>{d.locationCoordinates}</td>
                <td>
                  {d.status === "Scheduled" || d.status === "scheduled" ? (
                    <Image src={calender} alt="calender" />
                  ) : d.status === "Not Confirmed" ? (
                    <Image src={clock} alt="clock" />
                  ) : d.status === "Cancel" || d.status === "cancel" ? (
                    <Image src={cancel} alt="cancel" />
                  ) : d.status === "Complete" || d.status === "complete" ? (
                    <Image src={complete} alt="complete" />
                  ) : (
                    ""
                  )}
                  &nbsp;{d.status}
                </td>
                <td>{d.sectorName}</td>
                <td>{d.groups}</td>
                <td>
                  <DeleteModal handleDelete={handleDelete} id={d.id} />
                </td>
                <td>
                  <ProjectForm
                    api={projectAPI}
                    method="PUT"
                    id={d.id}
                    setRefresh={setRefresh}
                    refresh={refresh}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row d-flex">
          <div className="col-lg-6 col-md-6 col-sm-12">
            {/* Display the current range and total */}
            {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, data.length)} of{" "}
            {data.length}
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="row d-flex justify-content-end">
              <div className="col-lg-2 col-md-1 col-sm-12"></div>
              <div className="col-lg-5 col-md-6 col-sm-12 text-end">
                <label htmlFor="rowPerPage" className="form-label text-white">
                  Rows Per Page:
                </label>
              </div>
              <div className="col-lg-2 col-md-6 col-sm-12 text-start">
                <select
                  className="form-select form-select-sm bg-color-sea-green text-white"
                  style={{ color: "#fff" }}
                  aria-label="Rows per page"
                  name="rowPerPage"
                  value={rows}
                  onChange={handleRowsPerPage}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-12 text-end">
                <button
                  className="btn btn-sm bg-color-sea-green shadow-sm me-2"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <Image src={arrowLeft} alt="arrow left" />
                </button>
                <button
                  className="btn btn-sm bg-color-sea-green shadow-sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <Image src={arrowRight} alt="arrow right" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsList;
