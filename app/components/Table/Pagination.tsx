import { Dispatch, SetStateAction } from "react";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import Button from "../Button";

interface Props {
  searchTerm: string;
  filteredData: any[];
  data: any[];
  rows: number;
  setRows: Dispatch<SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  status?: string;
}

const Pagination = ({
  searchTerm,
  filteredData,
  data,
  rows,
  setRows,
  currentPage,
  setCurrentPage,
  status,
}: Props) => {
  const handleRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRows(parseInt(e?.target.value, 10));
    setCurrentPage(1);
  };

  // Determine the data to display for the current page
  const indexOfLastRow = currentPage * rows;
  const indexOfFirstRow = indexOfLastRow - rows;
  //   const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

  // for pagination buttons
  const totalPages = Math.ceil(
    (searchTerm || status ? filteredData : data).length / rows
  );
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

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5; // Maximum visible page numbers
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    if (startPage > 1) {
      pageNumbers.push(
        <Button
          key="ellipsis-start"
          className="btn bg-color-sea-green shadow me-2"
          disabled
          style={{ border: "1px solid #445E84" }}
        >
          ...
        </Button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          className={`btn ${
            i === currentPage
              ? "bg-color-matte-light-blue text-dark"
              : "bg-color-sea-green shadow text-white"
          } me-2`}
          onClick={() => handlePageChange(i)}
          style={{
            border: "1px solid #445E84",
          }}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <Button
          key="ellipsis-end"
          className="btn bg-color-sea-green shadow me-2 text-white"
          disabled
          style={{ border: "1px solid #445E84" }}
        >
          ...
        </Button>
      );
    }

    return pageNumbers;
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="row d-flex mb-3 m-0">
        <div className="col-lg-6 col-md-3 col-sm-12 mt-2">
          {/* Display the current range and total */}
          {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, data.length)} of{" "}
          {(searchTerm || status ? filteredData : data).length}
        </div>
        <div className="col-lg-6 col-md-9 col-sm-12">
          <div className="row d-flex justify-content-end align-items-center">
            {/* <div className="col-lg-2 col-md-1 col"></div> */}
            <div className="col text-end">
              <label htmlFor="rowPerPage" className="form-label mt-2">
                Rows Per Page:
              </label>
            </div>
            <div className="col-auto text-start">
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
          </div>
        </div>
      </div>
      <div className="col text-center mt-2">
        <Button
          className="btn bg-color-sea-green shadow me-2 text-white"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          style={{
            border: "1px solid #445E84",
          }}
        >
          <MdFirstPage size={20} />
        </Button>
        <Button
          className="btn bg-color-sea-green shadow me-2 text-white"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={{
            border: "1px solid #445E84",
          }}
        >
          <MdNavigateBefore size={20} />
        </Button>
        {renderPageNumbers()}
        <Button
          className="btn bg-color-sea-green shadow me-2 text-white"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            border: "1px solid #445E84",
          }}
        >
          <MdNavigateNext size={20} />
        </Button>
        <Button
          className="btn bg-color-sea-green shadow text-white"
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          style={{
            border: "1px solid #445E84",
          }}
        >
          <MdLastPage size={20} />
        </Button>
      </div>
    </>
  );
};

export default Pagination;
