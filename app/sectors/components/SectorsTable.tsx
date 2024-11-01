"use client";
import Image from "next/image";
import arrowLeft from "../../../public/icons/arrow-left.svg";
import arrowRight from "../../../public/icons/arrow-right.svg";
import { useEffect, useState } from "react";
import DeleteModal from "@/app/components/DeleteModal";
import { sectorAPI } from "@/app/APIs";
import SectorForm from "./SectorForm";
import { sort } from "fast-sort";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { ToastContainer, toast } from "react-toastify";
import useSectors, { Sector } from "@/app/hooks/useSectors";
import { DM_Sans, Inter } from "next/font/google";
import { getFormattedDate } from "@/app/utils";
import TableHeading from "@/app/components/TableHeading";
import Button from "@/app/components/Button";
import search2 from "../../../public/icons/search2.svg";

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
  const { data, setData, error, setError, isLoading } = useSectors({ refresh });
  const deleteMessage = "Deleted Successfully!";
  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Sector[]>([]);

  // Update filteredData when searchTerm or data changes
  useEffect(() => {
    if (searchTerm) {
      // Filter the data based on the search term
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = data.filter((item) => {
        // Search across multiple fields (id, name, description, sortId, createdAt, etc.)
        return (
          item.id.toString().includes(lowercasedFilter) ||
          item.name.toString().includes(lowercasedFilter) ||
          item.description.toString().includes(lowercasedFilter) ||
          item.sortId.toString().includes(lowercasedFilter)
          // ||
          // new Date(item.createdAt)
          //   .toLocaleDateString()
          //   .includes(lowercasedFilter) ||
          // new Date(item.updateAt)
          //   .toLocaleDateString()
          //   .includes(lowercasedFilter)
        );
      });
      setFilteredData(filtered);
    } else {
      // If search input is empty, reset filteredData to all data
      setFilteredData(data);
    }
  }, [searchTerm, data]);

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
      {isLoading && (
        <div className="col text-center">
          <div className="spinner-border text-primary"></div>
        </div>
      )}
      <div className="row d-flex p-3">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h4 className="fw-bold">Sectors</h4>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="row d-flex ">
            <div className="col d-none d-lg-block"></div>
            <div className="col text-end mt-2">
              <span className="fw-bold">
                {getFormattedDate(new Date(), "short")}
              </span>
              &nbsp;Today
            </div>
            <div className="col text-end">
              <SectorForm
                api={sectorAPI}
                method="POST"
                setRefresh={setRefresh}
                refresh={refresh}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row d-flex justify-content-between p-3">
        <div className="col-lg-6 col-md-5 col-sm-12">
          <p>
            Showing:{" "}
            <span className="fw-bold">
              {searchTerm ? filteredData.length : data?.length} Sectors
            </span>
          </p>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="input-group">
            <span
              className="input-group-text pe-0 border-0 rounded-end rounded-pill"
              id="basic-addon1"
              style={{ background: "rgba(16, 143, 168, .1)" }}
            >
              <Image
                src={search2}
                alt="search2"
                width={20}
                height={20}
                style={{
                  color: "#7e7e7e !important",
                }}
              />
            </span>
            <input
              type="text"
              className="form-control border-0 rounded-start rounded-pill"
              style={{ background: "rgba(16, 143, 168, .1)" }}
              id="username"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
            {searchTerm
              ? filteredData.map((d) => (
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
                        getFormattedDate(new Date(d.createdAt), "numeric")}
                    </td>
                    <td>
                      {d.updateAt &&
                        getFormattedDate(new Date(d.updateAt), "numeric")}
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
                      />
                    </td>
                  </tr>
                ))
              : currentData.map((d) => (
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
                        getFormattedDate(new Date(d.createdAt), "numeric")}
                    </td>
                    <td>
                      {d.updateAt &&
                        getFormattedDate(new Date(d.updateAt), "numeric")}
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

export default SectorsTable;
