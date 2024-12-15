import { getFormattedDate } from "@/app/utils";
import { ReactNode } from "react";
import { IoSearch } from "react-icons/io5";

interface Props {
  heading: string;
  searchTerm: string;
  filteredData: any[];
  data: any[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  form: ReactNode;
  status?: string;
}

const TableHeader = ({
  heading,
  searchTerm,
  filteredData,
  data,
  handleChange,
  form,
  status,
}: Props) => {
  return (
    <>
      <div className="row d-flex p-3">
        <div className="col">
          <h4 className="fw-bold">{heading}</h4>
        </div>
        <div className="col text-end mt-1">
          <span className="fw-bold">
            {getFormattedDate(new Date(), "short")}
          </span>
          &nbsp;Today
        </div>
        {form}
      </div>
      <div className="row d-flex justify-content-between p-3">
        <div className="col-lg-6 col-md-5 col-sm-12">
          <p>
            Showing:{" "}
            {status ? (
              <span className="fw-bold">
                {searchTerm || status ? filteredData.length : data?.length}/
                {searchTerm || status ? filteredData.length : data?.length}{" "}
                {status} {heading}
              </span>
            ) : (
              <span className="fw-bold">
                {searchTerm ? filteredData.length : data?.length}/
                {searchTerm ? filteredData.length : data?.length} {heading}
              </span>
            )}
          </p>
        </div>
        <div className="col-lg-4 col-md-6 col-sm-12">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <input
                type="text"
                className="form-control border-0 rounded-pill rounded-end"
                style={{
                  background: "rgba(16, 143, 168, .1)",
                  outline: "none",
                  border: "1px solid #D0D5DD",
                }}
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
              />
              <button
                className="btn rounded-start rounded-pill bg-color-sea-green text-white"
                type="submit"
              >
                <IoSearch className="mb-1" style={{ color: "#fff" }} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TableHeader;
