"use client";
import { sectorAPI } from "@/app/APIs";
import DeleteModal from "@/app/components/DeleteModal";
import Loader from "@/app/components/Loader";
import Pagination from "@/app/components/Table/Pagination";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/TableHeading";
import useSectors, { Sector } from "@/app/hooks/useSectors";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getFormattedDate } from "@/app/utils";
import { sort } from "fast-sort";
import { DM_Sans, Inter } from "next/font/google";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import SectorForm from "./SectorForm";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({ subsets: ["latin"] });

interface SectorsTableProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const SectorsTable = ({ refresh, setRefresh }: SectorsTableProps) => {
  const { data, setData, setError, isLoading } = useSectors({ refresh });
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Sector[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      [item.id.toString(), item.name, item.description, item.sortId.toString()]
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

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Sector;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Sector) => {
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

  // for selecting rows per page
  const [rows, setRows] = useState(10); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Paginate data to display only the current page's rows
  const paginatedData = (searchTerm ? filteredData : data).slice(
    (currentPage - 1) * rows,
    currentPage * rows
  );

  const getParentSector = (parsentSectorId: number, data: Sector[]) => {
    const sector = data.find((sector) => sector.id === parsentSectorId);
    return sector?.name;
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${sectorAPI}/${id}`);
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

  return (
    <>
      {isLoading && <Loader />}
      <TableHeader
        heading="Sectors"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <SectorForm
              api={sectorAPI}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
              setData={setData}
            />
          </div>
        }
      />
      <div className="table-responsive">
        <table
          className="table table-hover mb-5"
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
              <TableHeading name="name" handleSort={() => handleSort("name")} />
              <TableHeading
                name="description"
                handleSort={() => handleSort("description")}
              />
              <TableHeading
                name="parent sector"
                handleSort={() => handleSort("parentId")}
              />
              <TableHeading
                name="sort id"
                handleSort={() => handleSort("sortId")}
              />
              <TableHeading
                name="created at"
                handleSort={() => handleSort("createdAt")}
              />
              <TableHeading
                name="update at"
                handleSort={() => handleSort("updateAt")}
              />
              <th colSpan={2}></th>
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
                <td>{d.name}</td>
                <td>{d.description}</td>
                <td>{getParentSector(d.parentId, data)}</td>
                <td>{d.sortId}</td>
                <td>
                  {d.createdAt &&
                    getFormattedDate(new Date(d.createdAt), "short")}
                </td>
                <td>
                  {d.updateAt &&
                    getFormattedDate(new Date(d.updateAt), "short")}
                </td>
                <td>
                  <DeleteModal handleDelete={handleDelete} id={d.id} />
                </td>
                <td>
                  <SectorForm
                    api={sectorAPI}
                    method="PUT"
                    id={d.id}
                    setRefresh={setRefresh}
                    refresh={refresh}
                    setData={setData}
                  />
                </td>
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

export default SectorsTable;
