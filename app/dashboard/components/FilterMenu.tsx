"use client";
import Image from "next/image";
import filterBlack from "../../../public/icons/filterBlack.svg";
import Button from "@/app/components/Button";
import apiClient from "@/app/services/api-client";
import { filterSettingAPI } from "@/app/APIs";
import { useEffect, useRef, useState } from "react";
import { FilterData } from "./Dashboard";

interface Filter {
  label: string;
  filterIdentifier: string;
  dataType: string;
  filterValues: [string];
}

interface Props {
  handleSubmit: (filterData: FilterData[]) => Promise<void>;
  handleDistrictClick: (filterData: FilterData[]) => Promise<void>;
  filterFixedOption: FilterData;
}

const FilterMenu = ({
  filterFixedOption,
  handleDistrictClick,
  handleSubmit,
}: Props) => {
  const [data, setData] = useState<Filter[]>();
  // State to hold filter data
  const [filterData, setFilterData] = useState<FilterData[]>([]);

  // Ref array for select elements to reset them on "Reset" click
  const selectRefs = useRef<Array<HTMLSelectElement | null>>([]);

  // Handler for select change
  const handleSelectChange = (identifier: string, value: string) => {
    setFilterData((prevFilters) => {
      // Remove the filter if the selected value is empty
      if (value === "") {
        return prevFilters.filter(
          (filter) => filter.filterIdentifier !== identifier
        );
      }

      // Check if the filter already exists
      const existingFilterIndex = prevFilters.findIndex(
        (filter) => filter.filterIdentifier === identifier
      );

      if (existingFilterIndex !== -1) {
        // Update the existing filter
        const updatedFilters = [...prevFilters];
        updatedFilters[existingFilterIndex].filterValues = value;
        return updatedFilters;
      } else {
        // Add a new filter
        return [
          ...prevFilters,
          { filterIdentifier: identifier, filterValues: value },
        ];
      }
    });
  };

  // Reset function to clear filters and reset selects
  const handleReset = () => {
    setFilterData([]); // Clear the filter data

    // Reset each select element to the default (first) option
    selectRefs.current.forEach((select) => {
      if (select) {
        select.selectedIndex = 0; // Reset select element to the first option
      }
    });
  };

  useEffect(() => {
    const getFilters = async (userId: number) => {
      try {
        const response = await apiClient.get(
          `${filterSettingAPI}/GetUserFilters?userId=${userId}`
        );
        setData(response.data.data);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    getFilters(0);
  }, []);

  return (
    <>
      <Button
        type="button"
        className="btn rounded-pill"
        data-bs-toggle="modal"
        data-bs-target="#filterMenu"
      >
        <Image src={filterBlack} alt="filterBlack" width={18} height={18} />
      </Button>

      <div
        className="modal fade"
        id="filterMenu"
        aria-labelledby="filterMenuLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" style={{ marginTop: "80px" }}>
          <div
            className="modal-content border-0"
            style={{ background: "rgba(255,255,255,0)" }}
          >
            <div className="modal-body p-0">
              <div
                className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
                style={{
                  borderRadius: "20px",
                  background: "#fff",
                }}
              >
                <h3 className="fw-bold text-center">Filter Menu</h3>
                <div className="row d-flex mb-3">
                  {data &&
                    data.map((d, i) => (
                      <div
                        key={i}
                        className="col-lg-6 col-md-6 col-sm-12 text-start mb-3"
                      >
                        <label htmlFor={d.label} className="form-label">
                          {d.label}
                        </label>
                        <select
                          ref={(el) => {
                            selectRefs.current[i] = el;
                          }} // Type-safe ref assignment
                          className="form-select form-select-sm"
                          aria-label={d.label}
                          name={d.label}
                          onChange={(e) =>
                            handleSelectChange(
                              d.filterIdentifier,
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select</option>
                          {d.filterValues.map((f, i) => (
                            <option key={i} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  <div className="col-lg-6 col-md-6 col-sm-12 text-start mb-3">
                    <label htmlFor="sectorId" className="form-label">
                      Department
                    </label>
                    <select
                      className="form-select form-select-sm"
                      name="sectorId"
                      //   onChange={}
                      //   value={}
                    >
                      <option value={0}>None</option>
                      <option value={1}>asd</option>
                    </select>
                  </div>
                </div>
                <div className="row d-flex">
                  <div className="col-lg-6 col-md-6 col-sm-12 text-end">
                    <Button
                      className="btn w-50 fs-5 text-white"
                      data-bs-dismiss="modal"
                      onClick={() => {
                        filterData.push(filterFixedOption);
                        handleSubmit(filterData);
                      }}
                      aria-label="Close"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #0C8CE9 , #13629B)",
                        border: "0px",
                      }}
                    >
                      Filter
                    </Button>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                    <Button
                      className="btn w-50 fs-5"
                      onClick={handleReset}
                      style={{
                        border: "2px solid #0C8CE9",
                        color: "#0C8CE9",
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterMenu;
