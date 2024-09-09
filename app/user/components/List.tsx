"use client";
import Image from "next/image";
import arrowLeft from "../../../public/icons/arrow-left.svg";
import arrowRight from "../../../public/icons/arrow-right.svg";
import DeleteModal from "@/app/components/DeleteModal";
import { userAPI } from "@/app/APIs";
import Form from "./Form";
import useUsers, { User } from "@/app/hooks/useUsers";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { sort } from "fast-sort";
import TableHeading from "@/app/sectors/components/TableHeading";

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const List = ({ refresh, setRefresh }: ListProps) => {
  const { data, setData, setError, error, isLoading } = useUsers({ refresh });
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${userAPI}/${id}`);
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

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof User) => {
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

  return (
    <>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && (
        <div className="col text-center">
          <div className="spinner-border text-primary"></div>
        </div>
      )}
      <div className="table-responsive ">
        <table className="table mb-5" style={{ border: ".5px solid #858585" }}>
          <thead>
            <tr
              className="color-dark-blue"
              style={{ border: "1px solid #858585 !important" }}
            >
              <TableHeading name="id" handleSort={() => handleSort("id")} />
              <TableHeading name="name" handleSort={() => handleSort("name")} />
              <TableHeading
                name="email"
                handleSort={() => handleSort("email")}
              />
              <TableHeading
                name="phone"
                handleSort={() => handleSort("phone")}
              />
              <TableHeading
                name="role id"
                handleSort={() => handleSort("roleId")}
              />
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentData?.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.email}</td>
                <td>{d.phone}</td>
                <td>{d.roleId}</td>
                <td>
                  <div className="row d-flex">
                    <div className="col">
                      <DeleteModal handleDelete={handleDelete} id={d.id} />
                    </div>
                    <div className="col">
                      <Form
                        api={userAPI}
                        method="PUT"
                        id={d.id}
                        setRefresh={setRefresh}
                        refresh={refresh}
                      />
                    </div>
                  </div>
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

export default List;
