"use client";
import Image from "next/image";
import arrowLeft from "../../../public/icons/arrow-left.svg";
import arrowRight from "../../../public/icons/arrow-right.svg";
import { useState } from "react";
import DeleteModal from "@/app/components/DeleteModal";
import { attributesAPI } from "@/app/APIs";
import Form from "./Form";
import { sort } from "fast-sort";
import TableHeading from "@/app/sectors/components/TableHeading";
import useAttributes, { Attribute } from "../../hooks/useAttributes";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { ToastContainer, toast } from "react-toastify";

interface Props {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const List = ({ refresh, setRefresh }: Props) => {
  const { data, setData, setError, error, isLoading } = useAttributes({
    refresh,
  });
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Attribute;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Attribute) => {
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

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${attributesAPI}/${id}`);
      // remove the deleted item from the data array
      setData((prevData) => prevData.filter((item) => item.attributeId !== id));
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
      {error && <p className="text-danger">{error}</p>}
      {isLoading && (
        <div className="col text-center">
          <div className="spinner-border text-primary"></div>
        </div>
      )}
      <div className="table-responsive cursor-pointer">
        <table className="table mb-5" style={{ border: ".5px solid #858585" }}>
          <thead>
            <tr
              className="color-dark-blue"
              style={{ border: "1px solid #858585 !important" }}
            >
              <TableHeading
                name="attribute Id"
                handleSort={() => handleSort("attributeId")}
              />
              <TableHeading
                name="attribute data type"
                handleSort={() => handleSort("attributeDataType")}
              />
              <TableHeading
                name="multiselect"
                handleSort={() => handleSort("multiselect")}
              />
              <TableHeading
                name="label"
                handleSort={() => handleSort("label")}
              />
              <TableHeading
                name="validation regx"
                handleSort={() => handleSort("validationRegx")}
              />
              <TableHeading name="min" handleSort={() => handleSort("min")} />
              <TableHeading name="max" handleSort={() => handleSort("max")} />
              <TableHeading
                name="required"
                handleSort={() => handleSort("required")}
              />
              <TableHeading
                name="status"
                handleSort={() => handleSort("status")}
              />
              <TableHeading
                name="hidden"
                handleSort={() => handleSort("hidden")}
              />
              <TableHeading
                name="placeholder"
                handleSort={() => handleSort("placeholder")}
              />
              <TableHeading
                name="attribute type"
                handleSort={() => handleSort("attributeType")}
              />
              <TableHeading name="unit" handleSort={() => handleSort("unit")} />
              <TableHeading
                name="error message"
                handleSort={() => handleSort("errorMessage")}
              />
              <TableHeading
                name="verification type"
                handleSort={() => handleSort("verificationType")}
              />
              <TableHeading
                name="evaluation formula"
                handleSort={() => handleSort("evaluationFormula")}
              />
              <TableHeading
                name="weightage"
                handleSort={() => handleSort("weightage")}
              />
              <TableHeading
                name="remarks"
                handleSort={() => handleSort("remarks")}
              />
              <TableHeading
                name="options"
                handleSort={() => handleSort("options")}
              />
              <th colSpan={2}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentData?.map((d) => (
              <tr key={d.attributeId}>
                <td>{d.attributeId}</td>
                <td>{d.attributeDataType}</td>
                <td>{d.multiselect}</td>
                <td>{d.label}</td>
                <td>{d.validationRegx}</td>
                <td>{d.min}</td>
                <td>{d.max}</td>
                <td>{d.required}</td>
                <td>{d.status}</td>
                <td>{d.hidden}</td>
                <td>{d.placeholder}</td>
                <td>{d.attributeType}</td>
                <td>{d.unit}</td>
                <td>{d.errorMessage}</td>
                <td>{d.verificationType}</td>
                <td>{d.evaluationFormula}</td>
                <td>{d.weightage}</td>
                <td>{d.remarks}</td>
                <td>
                  {d.options?.map((option) => (
                    <>
                      {option.label}
                      ,&nbsp;
                    </>
                  ))}
                </td>
                <td>
                  <DeleteModal handleDelete={handleDelete} id={d.attributeId} />
                </td>
                <td>
                  <Form
                    api={attributesAPI}
                    method="PUT"
                    id={d.attributeId}
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
        <ToastContainer />
      </div>
    </>
  );
};

export default List;
