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
import {
  projectAPI,
  smdpSyncApi,
  smdpSyncAttributeValuesApi,
} from "@/app/APIs";
import ProjectForm from "./ProjectForm";
import { sort } from "fast-sort";
import { getFormattedDate, getName } from "@/app/utils";
import GroupingForm from "./GroupingForm";
import useProjects, { Project } from "@/app/hooks/useProjects";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { ToastContainer, toast } from "react-toastify";
import useSectors, { Sector } from "@/app/hooks/useSectors";
import useSuperGroups from "@/app/hooks/useSuperGroups";
import { DM_Sans, Inter } from "next/font/google";
import DownloadPDFBtn from "@/app/components/DownloadPDFBtn";
import TableHeading from "@/app/components/TableHeading";
import SyncModal from "./SyncModal";
import SmdpSyncForm from "./SmdpSyncForm";
import AssignUserForm from "./AssignUserForm";
import useAuthentication from "@/app/hooks/useAuthentication";
import Button from "@/app/components/Button";
import SmdpAllProjectsSyncForm from "./SmdpAllProjectsSyncForm";
import search2 from "../../../public/icons/search2.svg";
import Loader from "@/app/components/Loader";
import { IoSearch } from "react-icons/io5";
import TableHeader from "@/app/components/Table/TableHeader";
import Pagination from "@/app/components/Table/Pagination";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({ subsets: ["latin"] });

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  showData: boolean;
  setShowData: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Option {
  id: number;
  superGroupLabel: string;
}

export interface UserOption {
  id: number;
  userName: string;
}

const ProjectsList = ({
  refresh,
  setRefresh,
  showData,
  setShowData,
}: ListProps) => {
  const { data, setData, error, setError, isLoading, setLoading } = useProjects(
    {
      refresh,
    }
  );
  const { data: sectorsData } = useSectors({ refresh });
  const { data: superGroups } = useSuperGroups({ refresh });
  const { data: users } = useAuthentication({ refresh });
  const [originalData, setOriginalData] = useState<Project[]>([]); // Store the original data

  const deleteMessage = "Deleted Successfully!";
  const syncMessage = "Attribute Values synced Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Project[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      [item.id.toString(), item.gsNo, item.name, item.status]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(e.target.value.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e);
  };

  useEffect(() => {
    setOriginalData(data);
  }, [refresh, data]);

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

  const handleDelete = async (id: number): Promise<void> => {
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

  // Determine the data to display for the current page
  const indexOfLastRow = currentPage * rows;
  const indexOfFirstRow = indexOfLastRow - rows;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

  // Paginate data to display only the current page's rows
  const paginatedData = (searchTerm ? filteredData : data).slice(
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
        {isLoading && <Loader />}
        <TableHeader
          heading="Projects"
          searchTerm={searchTerm}
          filteredData={filteredData}
          data={data}
          handleChange={handleChange}
          form={
            <>
              <div className="col text-end mb-2">
                {/* <ProjectForm
              api={projectAPI}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
            /> */}
                <SmdpSyncForm
                  api={smdpSyncApi}
                  method="POST"
                  setRefresh={setRefresh}
                  refresh={refresh}
                  showData={showData}
                  setShowData={setShowData}
                />
              </div>
              <div className="col text-end">
                <SmdpAllProjectsSyncForm
                  api={smdpSyncApi}
                  method="POST"
                  setRefresh={setRefresh}
                  refresh={refresh}
                  showData={showData}
                  setShowData={setShowData}
                />
              </div>
            </>
          }
        />
      </>
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
                name="gs No"
                handleSort={() => handleSort("gsNo")}
              />
              <TableHeading name="name" handleSort={() => handleSort("name")} />
              <TableHeading
                name="sector"
                handleSort={() => handleSort("sectorId")}
              />
              <TableHeading
                name="status"
                handleSort={() => handleSort("status")}
              />
              <th style={{ whiteSpace: "nowrap" }}>ASSIGN USER</th>
              {/* <th style={{ whiteSpace: "nowrap" }}>SYNC ATTRIBUTES</th> */}
              <th style={{ whiteSpace: "nowrap" }}>SUPER GROUP</th>
              {/* <th colSpan={1}>
                <div className="text-center"></div>
              </th> */}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((d) => (
              <tr
                className={dmSans.className}
                style={{
                  border: ".41px solid rgba(81,81,81,0.20) !important",
                  fontSize: ".85rem",
                }}
                key={d.id}
              >
                <td>{d.id}</td>
                <td>{d.gsNo}</td>
                <td>{d.name}</td>
                <td>{getName(d.sectorId, sectorsData)}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {d.status.toLowerCase() === "scheduled" ? (
                    <Image
                      src={calender}
                      style={{ marginBottom: "3px" }}
                      alt="calender"
                    />
                  ) : d.status.toLowerCase() === "not confirmed" ? (
                    <Image
                      src={clock}
                      style={{ marginBottom: "3px" }}
                      alt="clock"
                    />
                  ) : d.status.toLowerCase() === "un-approved" ? (
                    <Image
                      src={cancel}
                      style={{ marginBottom: "3px" }}
                      alt="cancel"
                    />
                  ) : d.status.toLowerCase() === "completed" ? (
                    <Image
                      src={complete}
                      style={{ marginBottom: "3px" }}
                      alt="complete"
                    />
                  ) : d.status.toLowerCase().startsWith("approved") ? (
                    <Image
                      src={complete}
                      style={{ marginBottom: "3px" }}
                      alt="complete"
                    />
                  ) : d.status.toLowerCase() === "active" ? (
                    <Image
                      src={calender}
                      style={{ marginBottom: "3px" }}
                      alt="calender"
                    />
                  ) : d.status.toLowerCase() === "draft" ? (
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
                <td className="text-center">
                  <AssignUserForm id={d.id} options={users} />
                </td>
                {/* <td className="text-center">
                  <SyncModal handleSubmit={handleSync} id={d.smdpProjectID} />
                </td> */}
                <td className="text-center">
                  <GroupingForm id={d.id} options={superGroups} />
                </td>
                {/* <td>
                  <DeleteModal handleDelete={handleDelete} id={d.id} />
                </td> */}
                {/* <td>
                  <DownloadPDFBtn />
                </td> */}
                {/* <td>
                  <ProjectForm
                    api={projectAPI}
                    method="PUT"
                    id={d.id}
                    setRefresh={setRefresh}
                    refresh={refresh}
                  />
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          searchTerm={searchTerm}
          filteredData={filteredData}
          data={data}
          rows={rows}
          setRows={setRows}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <ToastContainer />
      </div>
    </>
  );
};

export default ProjectsList;
