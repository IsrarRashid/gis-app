"use client";
import Image from "next/image";
import arrowLeft from "../../../public/icons/arrow-left.svg";
import arrowRight from "../../../public/icons/arrow-right.svg";
import upDownArrow from "../../../public/icons/upDownArrow.svg";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import DeleteModal from "@/app/components/DeleteModal";
import { sectorAPI } from "@/app/APIs";
import SectorForm from "./SectorForm";
import { sort } from "fast-sort";
import TableHeading from "./TableHeading";

interface Props {
  id: number;
  parentId: number;
  name: "";
  description: "";
  createdAt: "";
  updateAt: "";
  sortId: number;
  parentName: "";
}
interface SectorsTableProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
const SectorsTable = ({ refresh, setRefresh }: SectorsTableProps) => {
  const [data, setData] = useState<Props[]>([]);

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

  const getParentSector = (parsentSectorId: number, data: Props[]) => {
    const sector = data.find((sector) => sector.id === parsentSectorId);
    return sector?.name;
  };

  useEffect(() => {
    const loadItems = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const response = await axios.get(sectorAPI, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setData(response.data.data);
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
        await axios.delete(`${sectorAPI}/${id}`, {
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

  return (
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
              name="description"
              handleSort={() => handleSort("description")}
            />
            <TableHeading
              name="parent sector"
              handleSort={() => handleSort("parentName")}
            />
            <TableHeading
              name="sort id"
              handleSort={() => handleSort("sortId")}
            />
            <th colSpan={2}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {currentData?.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.description}</td>
              <td>{getParentSector(d.parentId, data)}</td>
              <td>{d.sortId}</td>
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
  );
};

export default SectorsTable;
