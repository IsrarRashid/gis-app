"use client";

import { addDayToFormattedDate, getFormattedDate } from "@/app/utils";
import { ReactNode, useEffect, useRef, useState } from "react";
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
  const [isInputFocused, setIsInputFocused] = useState(false); // Detect input focus

  const inputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside the input field
  useEffect(() => {
    if (typeof window === "undefined") return; // Prevents SSR crash
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="row d-flex m-0 p-3">
        <div className="col">
          <h4 className="fw-bold">{heading}</h4>
        </div>
        <div className="col text-end mt-1">
          <span className="fw-bold">
            {addDayToFormattedDate(getFormattedDate(new Date(), "short")!)}
          </span>
          &nbsp;Today
        </div>
        {form}
      </div>
      <div className="row d-flex justify-content-between p-3 m-0">
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
              <span
                className="rounded-end rounded-pill border-0"
                style={{
                  opacity: isInputFocused ? 1 : 0,
                  visibility: isInputFocused ? "visible" : "hidden",
                  transform: isInputFocused
                    ? "translateX(0)"
                    : "translateX(40px)",
                  boxSizing: "border-box",
                  background: "rgba(16, 143, 168, 0.1)",
                  padding: "7.5px 0px 7.5px 10px",
                  boxShadow: isInputFocused
                    ? "0 -2px 0 #108fa8, -2px 0 0 #108fa8, 0 2px 0 #108fa8"
                    : "none", // Top, left, bottom only
                  transition: "all .3s",
                }}
              >
                <IoSearch />
              </span>
              <input
                type="text"
                className={`form-control border-0 ${
                  isInputFocused ? "m-0" : "ps-3 rounded-pill rounded-end"
                }`}
                style={{
                  boxSizing: "border-box",
                  background: "rgba(16, 143, 168, .1)",
                  boxShadow: isInputFocused
                    ? "0 -2px 0 #108fa8, 2px 0 0 #108fa8, 0 2px 0 #108fa8"
                    : "none", // Top, left, bottom only
                  outline: "none",
                  transition: "all .2s",
                }}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
                id="search"
              />
              <button
                className="btn rounded-start rounded-pill bg-color-sea-green text-white border-0 m-0"
                type="submit"
                style={{
                  boxShadow: isInputFocused
                    ? "0 -2px 0 #108fa8, -2px 0 0 #108fa8, 0 2px 0 #108fa8"
                    : "none", // Top, left, bottom only
                  transition: "all .3s",
                }}
              >
                <IoSearch className="my-auto" style={{ color: "#fff" }} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TableHeader;
