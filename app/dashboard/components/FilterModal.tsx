"use client";
import { FILTER_SETTING_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import apiClient from "@/app/services/api-client";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import filterBlack from "../../../public/icons/filterBlack.svg";
import { FilterData } from "./Dashboard";
import { Modal } from "react-bootstrap";

interface Filter {
  label: string;
  filterIdentifier: string;
  dataType: string;
  filterValues: [string];
}

interface Props {
  otherFilters: FilterData[];
  setOtherFilters: Dispatch<SetStateAction<FilterData[]>>;
  handleSubmit: (filterData: FilterData[]) => Promise<void>;
  combinedFilters: FilterData[];
  activeFilter: string;
  cmInitiativeFilters: FilterData[];
  adpFilters: FilterData[];
}

const FilterModal = ({
  otherFilters,
  setOtherFilters,
  handleSubmit,
  combinedFilters,
  activeFilter,
  cmInitiativeFilters,
  adpFilters,
}: Props) => {
  const [data, setData] = useState<Filter[]>();
  const [count, setCount] = useState(otherFilters.length);
  // State to hold filter data
  // const [filterData, setOtherFilters] = useState<FilterData[]>([]);

  // Ref array for select elements to reset them on "Reset" click
  const selectRefs = useRef<Array<HTMLSelectElement | null>>([]);
  const [selectedIndices, setSelectedIndices] = useState<{
    [key: number]: boolean;
  }>({});

  // Handler for select change
  const handleSelectChange = (
    identifier: string,
    value: string,
    index: number
  ) => {
    setOtherFilters((prevFilters) => {
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
    const nonEmptySelects = selectRefs.current.filter(
      (select) => select && select.value
    ).length;
    setCount(nonEmptySelects);
    setSelectedIndices((prev) => ({
      ...prev,
      [index]: value !== "", // True if an option is selected, false if default
    }));
  };

  // Reset function to clear filters and reset selects
  const handleReset = () => {
    setOtherFilters([]); // Clear the filter data
    setSelectedIndices({});
    setCount(0);
    if (activeFilter === "cmInitiative") {
      handleSubmit([...cmInitiativeFilters]);
    } else {
      handleSubmit([...adpFilters]);
    }
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
          `${FILTER_SETTING_API}/GetUserFilters?userId=${userId}`
        );
        setData(response.data.data);
        console.log("filtersss", response);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    getFilters(0);
  }, []);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        type="button"
        className="btn rounded-pill position-relative"
        onClick={handleShow}
      >
        <Image src={filterBlack} alt="filterBlack" width={18} height={18} />
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {count}
          <span className="visually-hidden">unread messages</span>
        </span>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        centered
        id="filterModal"
        dialogClassName="custom-modal"
      >
        <Modal.Body>
          <div
            className="border-0"
            style={{ background: "rgba(255,255,255,0)" }}
          >
            <div className="p-0">
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
                          id={d.label}
                          ref={(el) => {
                            selectRefs.current[i] = el;
                          }} // Type-safe ref assignment
                          className="form-select form-select-sm"
                          aria-label={d.label}
                          name={d.label}
                          style={{
                            backgroundColor: selectedIndices[i]
                              ? "yellow"
                              : "white", // Change background color
                          }}
                          onChange={(e) =>
                            handleSelectChange(
                              d.filterIdentifier,
                              e.target.value,
                              i
                            )
                          }
                        >
                          <option value="">Select</option>
                          {d.filterValues.map((f, j) => (
                            <option key={j} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  {/* <div className="col-lg-6 col-md-6 col-sm-12 text-start mb-3">
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
                    </div> */}
                </div>
                <div className="row d-flex">
                  <div className="col-lg-6 col-md-6 col-sm-12 text-end">
                    <Button
                      className="btn w-50 fs-5 text-white"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        if (activeFilter === "cmInitiative") {
                          handleSubmit([
                            ...cmInitiativeFilters,
                            ...otherFilters,
                          ]);
                        } else {
                          handleSubmit([...adpFilters, ...otherFilters]);
                        }
                      }}
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
                      data-bs-dismiss="modal"
                      aria-label="Close"
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FilterModal;
