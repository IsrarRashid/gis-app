"use client";
import Image from "next/image";
import calender from "../../../public/icons/calendar.svg";
import clock from "../../../public/icons/clock.svg";
import cancel from "../../../public/icons/cancel.svg";
import complete from "../../../public/icons/complete.svg";
import arrowLeft from "../../../public/icons/arrow-left.svg";
import arrowRight from "../../../public/icons/arrow-right.svg";
import DeleteModal from "@/app/components/DeleteModal";
import { visitAPI } from "@/app/APIs";
import Form from "./Form";
import { sort } from "fast-sort";
import GroupingForm from "./GroupingForm";
import useVisits, { Visit } from "@/app/hooks/useVisits";
import useProjects from "@/app/hooks/useProjects";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { DM_Sans, Inter } from "next/font/google";
import { getFormattedDate, getName } from "@/app/utils";
import TableHeading from "@/app/components/TableHeading";
import useAuthentication from "@/app/hooks/useAuthentication";
import useVehicle from "@/app/hooks/useVehicle";
import useDriver from "@/app/hooks/useDriver";
import Button from "@/app/components/Button";
import { letterSpacing } from "html2canvas/dist/types/css/property-descriptors/letter-spacing";

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
  attributeId: number;
  label: string;
}

const List = ({ refresh, setRefresh }: ListProps) => {
  const { data, setData, setError, error, isLoading } = useVisits({
    refresh,
  });
  const { data: projects } = useProjects({ refresh });
  const { data: users } = useAuthentication({ refresh });
  const { data: vehicles } = useVehicle({ refresh });
  const { data: drivers } = useDriver({ refresh });
  const [status, setStatus] = useState("");
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Visit;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Visit) => {
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

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${visitAPI}/${id}`);
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
  const currentData: Visit[] = data.slice(indexOfFirstRow, indexOfLastRow);

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

  const handleFilterData = (data: Visit[], status: string) => {
    return data?.filter((d: any) => d.status === status);
  };

  return (
    <>
      {isLoading && (
        <div className="col text-center">
          <div className="spinner-border text-primary"></div>
        </div>
      )}
      <div className="row d-flex p-3">
        <div className="col-lg-6 col-md-6 col">
          <h4 className="fw-bold">Visits</h4>
        </div>
        <div className="col-lg-6 col-md-6 col">
          <div className="row d-flex ">
            <div className="col d-none d-lg-block"></div>
            <div className="col text-end">
              <span className="fw-bold">
                {getFormattedDate(new Date(), "short")}
              </span>{" "}
              Today
            </div>
          </div>
        </div>
      </div>
      <div className="row d-flex">
        <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
          <Button
            className="btn btn-warning w-100 text-white fw-bold"
            style={{ letterSpacing: 1 }}
            onClick={() => setStatus("pending")}
          >
            Pending
          </Button>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
          <Button
            style={{ letterSpacing: 1 }}
            className="btn btn-info w-100 text-white fw-bold"
            onClick={() => setStatus("scheduled")}
          >
            Scheduled
          </Button>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
          <Button
            style={{ letterSpacing: 1 }}
            className="btn btn-success w-100 text-white fw-bold"
            onClick={() => setStatus("completed")}
          >
            Completed
          </Button>
        </div>
      </div>
      <div className="row p-3">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <p>
            Showing: <span className="fw-bold">{data?.length} Visits</span>
          </p>
        </div>
      </div>
      <div className="table-responsive">
        <table
          className="table mb-5"
          style={{ border: ".41px solid rgba(81,81,81,0.20) !important" }}
        >
          <thead>
            <tr
              className={`color-dark-blue cursor-pointer ${inter.className}`}
              style={{
                border: ".41px solid rgba(81,81,81,0.20) !important",
                fontSize: ".85rem",
              }}
            >
              <TableHeading name="id" handleSort={() => handleSort("id")} />
              <TableHeading
                name="project Id"
                handleSort={() => handleSort("projectId")}
              />
              <TableHeading
                name="assigned To"
                handleSort={() => handleSort("assignedTo")}
              />
              <TableHeading
                name="status"
                handleSort={() => handleSort("status")}
              />
              <TableHeading
                name="latitude"
                handleSort={() => handleSort("latitude")}
              />
              <TableHeading
                name="longitude"
                handleSort={() => handleSort("longitude")}
              />
              <TableHeading
                name="vehicle ID"
                handleSort={() => handleSort("vehicleID")}
              />
              <TableHeading
                name="driver ID"
                handleSort={() => handleSort("driverID")}
              />
              <TableHeading
                name="from Date"
                handleSort={() => handleSort("fromDate")}
              />
              <TableHeading
                name="to Date"
                handleSort={() => handleSort("toDate")}
              />
              <TableHeading
                name="created at"
                handleSort={() => handleSort("createdAt")}
              />
              <TableHeading
                name="updated at"
                handleSort={() => handleSort("updatedAt")}
              />
              <th colSpan={2}>
                <div className="text-center"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {handleFilterData(currentData, status)?.map((d) => (
              <tr
                style={{
                  border: ".41px solid rgba(81,81,81,0.20) !important",
                  fontSize: ".85rem",
                }}
                key={d.id}
              >
                <td>{d.id}</td>
                <td>{getName(d.projectId, projects)}</td>
                <td>{getName(d.assignedTo, users)}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {d.status === "scheduled" || d.status === "Scheduled" ? (
                    <Image
                      src={calender}
                      style={{ marginBottom: "3px" }}
                      alt="calender"
                    />
                  ) : d.status === "not confirmed" ||
                    d.status === "Not Confirmed" ||
                    d.status === "pending" ||
                    d.status === "Pending" ? (
                    <Image
                      src={clock}
                      style={{ marginBottom: "3px" }}
                      alt="clock"
                    />
                  ) : d.status === "cancel" || d.status === "Cancel" ? (
                    <Image
                      src={cancel}
                      style={{ marginBottom: "3px" }}
                      alt="cancel"
                    />
                  ) : d.status === "completed" || d.status === "Completed" ? (
                    <Image
                      src={complete}
                      style={{ marginBottom: "3px" }}
                      alt="complete"
                    />
                  ) : d.status.startsWith("approved") ||
                    d.status.startsWith("Approved") ? (
                    <Image
                      src={complete}
                      style={{ marginBottom: "3px" }}
                      alt="complete"
                    />
                  ) : d.status === "active" || d.status === "Active" ? (
                    <Image
                      src={calender}
                      style={{ marginBottom: "3px" }}
                      alt="calender"
                    />
                  ) : d.status === "draft" || d.status === "Draft" ? (
                    <Image
                      src={clock}
                      style={{ marginBottom: "3px" }}
                      alt="clock"
                    />
                  ) : (
                    ""
                  )}
                  &nbsp;{d.status}
                </td>
                <td>{d.latitude}</td>
                <td>{d.longitude}</td>
                <td>{d.vehicleID ? getName(d.vehicleID, vehicles) : ""}</td>
                <td>{d.driverID ? getName(d.driverID, drivers) : ""}</td>
                <td>{getFormattedDate(new Date(d.fromDate), "numeric")}</td>
                <td>{getFormattedDate(new Date(d.toDate), "numeric")}</td>
                <td>
                  {d.createdAt &&
                    getFormattedDate(new Date(d.createdAt), "numeric")}
                </td>
                <td>
                  {d.updatedAt &&
                    getFormattedDate(new Date(d.updatedAt), "numeric")}
                </td>
                <td>
                  <DeleteModal handleDelete={handleDelete} id={d.id} />
                </td>
                <td>
                  <Form
                    api={visitAPI}
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
        <div className="row d-flex mb-3">
          <div className="col-lg-6 col-md-3 col-sm-12 mt-2">
            {/* Display the current range and total */}
            {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, data.length)} of{" "}
            {data.length}
          </div>
          <div className="col-lg-6 col-md-9 col">
            <div className="row d-flex justify-content-end">
              <div className="col-lg-2 col-md-1 col"></div>
              <div className="col-lg-5 col-md-4 col text-end">
                <label htmlFor="rowPerPage" className="form-label mt-2">
                  Rows Per Page:
                </label>
              </div>
              <div className="col-lg-1 col-md-3 col text-start p-0">
                <select
                  className="rounded bg-color-sea-green text-white shadow p-2"
                  style={{
                    color: "#fff",
                    border: "1px solid #445E84",
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
                  className="btn bg-color-sea-green shadow me-2"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  style={{
                    border: "1px solid #445E84",
                  }}
                >
                  <Image src={arrowLeft} alt="arrow left" />
                </Button>
                <Button
                  className="btn bg-color-sea-green shadow"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  style={{
                    border: "1px solid #445E84",
                  }}
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

export default List;
