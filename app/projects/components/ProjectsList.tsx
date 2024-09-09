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
import ProjectForm from "./ProjectForm";
import { sort } from "fast-sort";
import TableHeading from "@/app/sectors/components/TableHeading";
import { getFormattedDate } from "@/app/utils";
import GroupingForm from "./GroupingForm";
import useProjects, { Project } from "@/app/hooks/useProjects";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { ToastContainer, toast } from "react-toastify";
import useSectors, { Sector } from "@/app/hooks/useSectors";
import useAttributeGroups from "@/app/hooks/useAttributeGroups";

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Option {
  id: number;
  name: string;
}

const ProjectsList = ({ refresh, setRefresh }: ListProps) => {
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
        {error && <p className="text-danger">{error}</p>}
        {isLoading && (
          <div className="col text-center">
            <div className="spinner-border text-primary"></div>
          </div>
        )}
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
                name="sector"
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
              <th colSpan={3}>
                <div className="text-center">ACTIONS</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData?.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{getName(d.sectorId, sectorsData)}</td>
                <td>{d.address}</td>
                <td>{d.city}</td>
                <td>{d.locationCoordinates}</td>
                <td>
                  {d.status === "scheduled" ? (
                    <Image src={calender} alt="calender" />
                  ) : d.status === "not confirmed" ? (
                    <Image src={clock} alt="clock" />
                  ) : d.status === "cancel" ? (
                    <Image src={cancel} alt="cancel" />
                  ) : d.status === "completed" ? (
                    <Image src={complete} alt="complete" />
                  ) : d.status === "active" ? (
                    <Image src={calender} alt="calender" />
                  ) : d.status === "draft" ? (
                    <Image src={clock} alt="clock" />
                  ) : (
                    ""
                  )}
                  &nbsp;{d.status}
                </td>
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
                <td>
                  <GroupingForm id={d.id} options={attributeGroups} />
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
        <ToastContainer />
      </div>
    </>
  );
};

export default ProjectsList;
