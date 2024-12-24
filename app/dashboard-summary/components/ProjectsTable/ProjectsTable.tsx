"use client";
import { singleProjectDashboardAPI } from "@/app/APIs";
import Button from "@/app/components/Button";
import TableHeading from "@/app/components/TableHeading";
import DownloadDropDown from "@/app/components/UserDropDown/DownloadDropDown";
import ProjectReportOverviewModal from "@/app/dashboard/components/projectReportOverview/ProjectReportOverviewModal";
import useDistrict from "@/app/hooks/useDistrict";
import useSectors from "@/app/hooks/useSectors";
import useUsers from "@/app/hooks/useUsers";
import apiClient from "@/app/services/api-client";
import {
  addDayToFormattedDate,
  exportToPDF,
  formatAmountWithCommas,
  getFormattedDate,
  getTimeLeft,
} from "@/app/utils";
import { exportDataToExcel } from "@/app/utils/exportToExcel";
import { format } from "date-fns";
import { sort } from "fast-sort";
import { DM_Sans, Inter } from "next/font/google";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS
import toast, { Toaster } from "react-hot-toast";
import { FaRegClock, FaSearch, FaUser } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineDateRange,
} from "react-icons/md";
import styles from "./ProjectsTable.module.css";

// Define the type of the range state
interface RangeType {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
}

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({ subsets: ["latin"] });

export interface ProjectsList {
  id: number;
  visitId: number;
  gSno: string;
  projectName: string;
  districtName: string;
  sectorName: string;
  userName: string;
  designation: string;
  reportCompletion: number;
  visitStartDate: string;
  visitEndDate: string;
  completedDate: string;
  deadline: string;
  submittedDate: string;
  issuedDate: string;
  status: string;
  cost: number;
  revisedAllocation: number;
  pnDReleases: number;
  visitCount: number;
  utilization: number;
  totalRevenueCost: number;
  totalCapitalCost: number;
  fileGenrated: string;
  reportStatus: string;
}

interface Props {
  projectsData: ProjectsList[];
  setProjectsData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
  label: string;
  keys: (keyof ProjectsList)[];
  allowLink?: boolean;
  searchTermDefault?: string;
}

const ProjectsTable = ({
  projectsData,
  setProjectsData,
  label,
  keys,
  allowLink = true,
  searchTermDefault,
}: Props) => {
  const [refresh, setRefresh] = useState(false);
  const { data: districts } = useDistrict({ refresh });
  const { data: sectors } = useSectors({ refresh });
  const { data: users } = useUsers({ refresh });

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<ProjectsList[]>([]);
  const [searchEnable, setsearchEnable] = useState(false);
  const [dropdownFilterValue, setDropdownFilterValue] = useState<string[]>([]);

  useEffect(() => {
    if (searchTermDefault) {
      setSearchTerm(searchTermDefault);
      handleSearch(searchTermDefault);
    }
  }, []);

  // Handle search logic
  const handleSearch = (value: string) => {
    // const lowercasedFilter = searchTerm.toLowerCase();

    const filtered = projectsData.filter((item) =>
      [
        item.id.toString(),
        item.projectName,
        item.sectorName,
        item.districtName,
        item.userName,
        item.designation,
        item.reportStatus,
      ]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(value.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm !== "") {
      // handleSearch();
    }
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ProjectsList;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof ProjectsList) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    const sortedData = projectsData && sort(projectsData)[direction](key);
    setSortConfig({ key, direction });
    if (sortedData) {
      setProjectsData([...sortedData]);
    }
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
  const currentData =
    projectsData && projectsData.slice(indexOfFirstRow, indexOfLastRow);

  // for pagination buttons
  const totalPages =
    projectsData &&
    Math.ceil(
      (searchTerm || dropdownFilterValue.length > 0
        ? filteredData
        : projectsData
      ).length / rows
    );
  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (totalPages) {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  // Paginate data to display only the current page's rows
  const paginatedData =
    projectsData &&
    (searchTerm || dropdownFilterValue.length > 0
      ? filteredData
      : projectsData
    ).slice((currentPage - 1) * rows, currentPage * rows);

  const handleProjectSubmit = async (projectId: number, visitId: number) => {
    try {
      const response = await apiClient.get(
        `${singleProjectDashboardAPI}?projectid=${projectId}&visit=${visitId}`
      );
      if (
        (response.data.data && response.data.data !== null) ||
        response.data.data.groups ||
        response.data.data.attributes ||
        response.data.data.groups.length > 0 ||
        response.data.data.attributes.length > 0
      ) {
        window.open(
          `/project-details-dashboard/${projectId}/${visitId}`,
          "_blank"
        );
        // router.push(`/projectDetailsDashboard/${projectId}/${visitId}`);
      } else {
        toast.error("This Project is not yet Monitored.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("This Project is not yet Monitored.");
    }
  };

  // pdf generation
  // const columns = [
  //   { header: "SR No", dataKey: "srNo" },
  //   { header: "GS No", dataKey: "id" },
  //   { header: "PROJECT NAME", dataKey: "projectName" },
  //   { header: "SECTOR NAME", dataKey: "sectorName" },
  //   { header: "DISTRICT NAME", dataKey: "districtName" },
  //   { header: "USER NAME", dataKey: "userName" },
  //   { header: "REPORT COMPLETION", dataKey: "reportCompletion" },
  //   { header: "VISIT DATE", dataKey: "visitStartDate" },
  //   { header: "COMPLETED DATE", dataKey: "completedDate" },
  //   { header: "DEADLINE", dataKey: "deadline" },
  //   { header: "REPORT GENERATED", dataKey: "fileGenrated" },
  // ];

  // const tableRows = (searchEnable ? filteredData : currentData).map(
  //   (data: any, index) => ({
  //     srNo: index + 1,
  //     id: data.id,
  //     projectName: data.projectName,
  //     districtName: data.districtName,
  //     sectorName: data.sectorName,
  //     userName: `${data.userName} (${data.designation})`,
  //     reportCompletion: `${Math.round(data.reportCompletion)}%`,
  //     visitStartDate:
  //       data.visitStartDate &&
  //       `${addDayToFormattedDate(
  //         getFormattedDate(new Date(data.visitStartDate), "short")!
  //       )}
  //       To
  //       ${
  //         data.visitEndDate &&
  //         addDayToFormattedDate(
  //           getFormattedDate(new Date(data.visitEndDate), "short")!
  //         )
  //       }
  //       `,
  //     completedDate:
  //       data.completedDate &&
  //       `${addDayToFormattedDate(
  //         getFormattedDate(new Date(data.completedDate), "short")!
  //       )}`,
  //     deadline:
  //       data.reportStatus && data.reportStatus.toLowerCase() === "yes"
  //         ? "Submitted"
  //         : `${addDayToFormattedDate(
  //             getFormattedDate(new Date(data.deadline), "short")!
  //           )}`,
  //     fileGenrated: data.fileGenrated,
  //   })
  // );

  const renameMap: Record<string, string> = {
    srNo: "Sr No",
    id: "GS No.",
    fileGenrated: "REPORT GENERATED",
    visitStartDate: "DATE RANGE",
    visitCount: "No. OF VISITS",
    // Add other mappings as needed
  };

  // Helper function to rename columns dynamically
  const formatKeyName = (key: string): string => {
    return renameMap[key] || key.replace(/([A-Z])/g, " $1").toUpperCase();
  };

  const keysForPDF = ["srNo", ...keys];
  const columns = keysForPDF.map((key) => ({
    header: formatKeyName(key), // Format key for header
    dataKey: key, // Use the key for data mapping
  }));

  const tableRows = (
    searchTerm || dropdownFilterValue.length > 0 ? filteredData : projectsData
  ).map((data: any, index) => {
    const row: Record<string, any> = { srNo: index + 1 }; // Initialize row with srNo

    keysForPDF.forEach((key) => {
      switch (key) {
        case "srNo":
          row[key] = index + 1;
          break;
        case "id":
          row[key] = data.id;
          break;
        case "projectName":
          row[key] = data.projectName;
          break;
        case "districtName":
          row[key] = data.districtName;
          break;
        case "sectorName":
          row[key] = data.sectorName;
          break;
        case "userName":
          row[key] = `${data.userName} (${data.designation})`;
          break;
        case "reportCompletion":
          row[key] = `${Math.round(data.reportCompletion)}%`;
          break;
        case "visitStartDate":
          row[key] =
            data.visitStartDate &&
            `${addDayToFormattedDate(
              getFormattedDate(new Date(data.visitStartDate), "short")!
            )} To ${
              data.visitEndDate &&
              addDayToFormattedDate(
                getFormattedDate(new Date(data.visitEndDate), "short")!
              )
            }`;
          break;
        case "completedDate":
          row[key] =
            data.completedDate &&
            `${addDayToFormattedDate(
              getFormattedDate(new Date(data.completedDate), "short")!
            )}`;
          break;
        case "deadline":
          row[key] =
            data.reportStatus && data.reportStatus.toLowerCase() === "yes"
              ? "Submitted"
              : `${getTimeLeft(data.deadline).replace("-", "")}`;
          break;
        case "fileGenrated":
          row[key] = data.fileGenrated;
          break;
        default:
          row[key] = data[key]; // Handle any additional keys dynamically
      }
    });

    return row;
  });

  // Export to Excel function
  const exportToExcel = () => {
    const headers = ["srNo", ...keys].map(formatKeyName); // Rename headers dynamically

    const data = (
      searchTerm || dropdownFilterValue.length > 0 ? filteredData : projectsData
    ).map((item: any, index) => {
      const row: Record<string, any> = {};

      headers.forEach((header) => {
        const key =
          Object.keys(renameMap).find((k) => formatKeyName(k) === header) ||
          header; // Find original key from renamed header

        switch (key) {
          case "srNo":
            row[header] = index + 1;
            break;
          case "id":
            row[header] = item.id;
            break;
          case formatKeyName("projectName"):
            row[header] = item.projectName;
            break;
          case formatKeyName("districtName"):
            row[header] = item.districtName;
            break;
          case formatKeyName("sectorName"):
            row[header] = item.sectorName;
            break;
          case formatKeyName("userName"):
            row[header] = `${item.userName} (${item.designation})`;
            break;
          case formatKeyName("reportCompletion"):
            row[header] = `${Math.round(item.reportCompletion)}%`;
            break;
          case "visitStartDate":
            row[header] =
              item.visitStartDate &&
              `${addDayToFormattedDate(
                getFormattedDate(new Date(item.visitStartDate), "short")!
              )} To ${
                item.visitEndDate &&
                addDayToFormattedDate(
                  getFormattedDate(new Date(item.visitEndDate), "short")!
                )
              }`;
            break;
          case formatKeyName("completedDate"):
            row[header] =
              item.completedDate &&
              `${addDayToFormattedDate(
                getFormattedDate(new Date(item.completedDate), "short")!
              )}`;
            break;
          case formatKeyName("deadline"):
            row[header] =
              item.reportStatus && item.reportStatus.toLowerCase() === "yes"
                ? "Submitted"
                : `${getTimeLeft(item.deadline).replace("-", "")}`;
            break;
          case "visitCount":
            row[header] = item.visitCount;
            break;
          case "fileGenrated":
            row[header] = item.fileGenrated;
            break;
          case formatKeyName("cost"):
            row[header] = item.cost;
            break;
          case formatKeyName("revisedAllocation"):
            row[header] = item.revisedAllocation;
            break;
          case formatKeyName("pnDReleases"):
            row[header] = item.pnDReleases;
            break;
          case formatKeyName("utilization"):
            row[header] = item.utilization;
            break;

          default:
            row[header] = item[formatKeyName(key)] || ""; // Handle any additional keys dynamically
        }
      });

      return row;
    });

    exportDataToExcel(
      data,
      headers,
      `${label} ${getFormattedDate(new Date(), "short")}.xlsx`
    );
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

  const [districtName, setDistrictName] = useState<string>();
  const [sectorName, setSectorName] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [reportSubmitted, setReportSubmitted] = useState<string>();
  const [reportGenerated, setReportGenerated] = useState<string>();

  const applyFilters = ({
    districtName = "",
    sectorName = "",
    userName = "",
    startDate = "", // Start date for  range
    endDate = "", // End date for  range
    reportGenerated = "", // Boolean for report generation
    reportSubmitted = "", // Boolean for report submission
  }) => {
    let filtered = projectsData;

    // Filter by district name
    if (districtName) {
      filtered = filtered.filter(
        (project) =>
          project.districtName.toLowerCase() === districtName.toLowerCase()
      );
    }

    // Filter by sector name
    if (sectorName) {
      filtered = filtered.filter(
        (project) =>
          project.sectorName.toLowerCase() === sectorName.toLowerCase()
      );
    }

    // Filter by userName
    if (userName) {
      filtered = filtered.filter((project) =>
        project.userName.toLowerCase().includes(userName.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((project) => {
        const projectDate = new Date(project.visitStartDate); // Ensure project date is a Date object
        const start = new Date(startDate); // Parse start date
        const end = new Date(endDate); // Parse end date

        // Check if projectDate is within the selected range
        return projectDate >= start && projectDate <= end;
      });
    }

    // Filter by report submitted
    if (reportSubmitted) {
      filtered = filtered.filter((project) =>
        project.reportStatus
          .toLowerCase()
          .includes(reportSubmitted.toLowerCase())
      );
    }

    // Filter by report generated
    if (reportGenerated) {
      filtered = filtered.filter((project) =>
        project.fileGenrated
          .toLowerCase()
          .includes(reportGenerated.toLowerCase())
      );
    }

    // Update the filtered data state
    setFilteredData(filtered);
  };

  const [dateRangeState, setDateRangeState] = useState<RangeType[]>([
    {
      startDate: undefined, // Initially no start date selected
      endDate: undefined, // Initially no end date selected
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: RangeKeyDict) => {
    const { selection } = ranges;

    // Ensure startDate and endDate are properly handled
    const updatedSelection = {
      startDate: selection.startDate || new Date(), // Provide a default date if undefined
      endDate: selection.endDate || new Date(), // Provide a default date if undefined
      key: selection.key || "selection",
    };

    // Update filters and UI state
    applyFilters({
      districtName,
      sectorName,
      userName,
      startDate: updatedSelection.startDate.toISOString().split("T")[0],
      endDate: updatedSelection.endDate.toISOString().split("T")[0],
      reportSubmitted,
      reportGenerated,
    });
    setDropdownFilterValue((prev) => {
      if (selection.startDate!.toString() === "") {
        // Remove "Start Date" from the filter
        return prev.filter((item) => !item.startsWith("Start Date:"));
      } else {
        // Add/Update "Start Date" in the filter
        const updated = prev.filter((item) => !item.startsWith("Start Date:"));
        return [...updated, `Start Date: ${selection.startDate!.toString()}`];
      }
    });
    setDropdownFilterValue((prev) => {
      if (selection.startDate!.toString() === "") {
        // Remove "Start Date" from the filter
        return prev.filter((item) => !item.startsWith("Start Date:"));
      } else {
        // Add/Update "Start Date" in the filter
        const updated = prev.filter((item) => !item.startsWith("Start Date:"));
        return [...updated, `Start Date: ${selection.startDate!.toString()}`];
      }
    });
    setDropdownFilterValue((prev) => {
      if (selection.startDate!.toString() === "") {
        // Remove "End Date" from the filter
        return prev.filter((item) => !item.startsWith("End Date:"));
      } else {
        // Add/Update "End Date" in the filter
        const updated = prev.filter((item) => !item.startsWith("End Date:"));
        return [...updated, `End Date: ${selection.startDate!.toString()}`];
      }
    });

    // Update state for the date range picker
    setDateRangeState([updatedSelection]);
  };

  const clearDateSelection = () => {
    setDateRangeState([
      {
        startDate: undefined,
        endDate: undefined,
        key: "selection",
      },
    ]);
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidenav = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="d-flex">
        <div
          className={`${styles.sidenav} ${isExpanded ? styles.expanded : ""}`}
        >
          <ul className="list-group p-0">
            <li className="list-group-item border-0 bg-transparent">
              <Button
                className="btn mb-5 p-0"
                onClick={toggleSidenav}
                aria-label="Toggle navigation"
              >
                <Image
                  src="/icons/collapseArrow.svg"
                  alt="collapseArrow"
                  width={20}
                  height={20}
                  style={{
                    transform: `${
                      isExpanded ? "rotate(180deg)" : "rotate(0deg)"
                    }`,
                    transition: "transform .3s",
                  }}
                />
              </Button>
            </li>
          </ul>

          <div className={`col p-2 ${!isExpanded && "d-none"}`}>
            <div className="col mb-3">
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
                    disabled={dropdownFilterValue.length > 0 ? true : false}
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

            {keys.includes("districtName") && (
              <div className="col mb-3 text-start">
                <label htmlFor="districtName" className="form-label">
                  District Name
                </label>
                <select
                  className="w-100"
                  style={{
                    background: "rgba(16, 143, 168, .1)",
                    outline: "none",
                    border: "1px solid #D0D5DD",
                  }}
                  aria-label="District Name"
                  name="districtName"
                  onChange={(e) => {
                    const value = e.target.value;
                    setDistrictName(value);
                    setDropdownFilterValue((prev) => {
                      if (value === "") {
                        // Remove "District Name" from the filter
                        return prev.filter(
                          (item) => !item.startsWith("District Name:")
                        );
                      } else {
                        // Add/Update "District Name" in the filter
                        const updated = prev.filter(
                          (item) => !item.startsWith("District Name:")
                        );
                        return [...updated, `District Name: ${value}`];
                      }
                    });
                    setDistrictName(e.target.value);
                    applyFilters({
                      districtName: e.target.value,
                      sectorName,
                      userName,
                      startDate: dateRangeState[0].startDate
                        ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
                        : "",
                      endDate: dateRangeState[0].endDate
                        ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
                        : "",
                      reportSubmitted,
                      reportGenerated,
                    });
                  }}
                  disabled={searchTerm ? true : false}
                >
                  <option value="">Select</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.districtName}>
                      {district.districtName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {keys.includes("visitStartDate") && (
              <div
                className="col mb-3 text-start"
                style={{ pointerEvents: `${searchTerm ? "none" : "auto"}` }}
              >
                <label htmlFor="userName" className="form-label">
                  Date Range
                </label>
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header id="dateFilterSideNavAccordian">
                      Select
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="col mb-3 text-start">
                        <DateRange
                          ranges={dateRangeState}
                          onChange={handleSelect}
                          moveRangeOnFirstSelection={false}
                          maxDate={new Date()} // Restrict future dates
                          dateDisplayFormat="dd/MM/yyyy"
                          className={styles.customDateRange}
                        />
                        <p>
                          Selected Range:{" "}
                          {dateRangeState[0].startDate
                            ? format(dateRangeState[0].startDate, "dd/MM/yyyy")
                            : "No start date"}{" "}
                          to{" "}
                          {dateRangeState[0].endDate
                            ? format(dateRangeState[0].endDate, "dd/MM/yyyy")
                            : "No end date"}
                        </p>
                        <button
                          onClick={() => {
                            setDropdownFilterValue((prev) => {
                              return prev.filter(
                                (item) =>
                                  !item.startsWith("Start Date:") &&
                                  !item.startsWith("End Date:")
                              );
                            });
                            setDateRangeState([
                              {
                                startDate: undefined,
                                endDate: undefined,
                                key: "selection",
                              },
                            ]);
                            applyFilters({
                              districtName,
                              sectorName,
                              userName,
                              startDate: "",
                              endDate: "",
                              reportSubmitted,
                              reportGenerated,
                            });
                          }}
                          style={{
                            padding: "10px 15px",
                            background: "#ff5c5c",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Clear Dates
                        </button>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            )}
            {keys.includes("sectorName") && (
              <div className="col mb-3 text-start">
                <label htmlFor="sectorName" className="form-label">
                  Sector Name
                </label>
                <select
                  className="w-100"
                  style={{
                    background: "rgba(16, 143, 168, .1)",
                    outline: "none",
                    border: "1px solid #D0D5DD",
                  }}
                  aria-label="Sector Name"
                  name="sectorName"
                  onChange={(e) => {
                    const value = e.target.value;
                    setSectorName(value);
                    setDropdownFilterValue((prev) => {
                      if (value === "") {
                        // Remove "Sector Name" from the filter
                        return prev.filter(
                          (item) => !item.startsWith("Sector Name:")
                        );
                      } else {
                        // Add/Update "Sector Name" in the filter
                        const updated = prev.filter(
                          (item) => !item.startsWith("Sector Name:")
                        );
                        return [...updated, `Sector Name: ${value}`];
                      }
                    });
                    applyFilters({
                      districtName,
                      sectorName: e.target.value,
                      userName,
                      startDate: dateRangeState[0].startDate
                        ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
                        : "",
                      endDate: dateRangeState[0].endDate
                        ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
                        : "",
                      reportSubmitted,
                      reportGenerated,
                    });
                  }}
                  disabled={searchTerm ? true : false}
                >
                  <option value="">Select</option>
                  {sectors.map((sector) => (
                    <option key={sector.id} value={sector.name}>
                      {sector.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {keys.includes("userName") && (
              <div className="col mb-3 text-start">
                <label htmlFor="userName" className="form-label">
                  UserName
                </label>
                <select
                  className="w-100"
                  style={{
                    background: "rgba(16, 143, 168, .1)",
                    outline: "none",
                    border: "1px solid #D0D5DD",
                  }}
                  aria-label="UserName"
                  name="userName"
                  onChange={(e) => {
                    const value = e.target.value;
                    setUserName(value);
                    setDropdownFilterValue((prev) => {
                      if (value === "") {
                        // Remove "User Name" from the filter
                        return prev.filter(
                          (item) => !item.startsWith("User Name:")
                        );
                      } else {
                        // Add/Update "User Name" in the filter
                        const updated = prev.filter(
                          (item) => !item.startsWith("User Name:")
                        );
                        return [...updated, `User Name: ${value}`];
                      }
                    });
                    applyFilters({
                      districtName,
                      sectorName,
                      userName: e.target.value,
                      startDate: dateRangeState[0].startDate
                        ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
                        : "",
                      endDate: dateRangeState[0].endDate
                        ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
                        : "",
                      reportSubmitted,
                      reportGenerated,
                    });
                  }}
                  disabled={searchTerm ? true : false}
                >
                  <option value="">Select</option>
                  {users.map((user) => (
                    <option key={user.user_Id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {keys.includes("deadline") && (
              <div className="col mb-3 text-start">
                <label htmlFor="reportSubmitted" className="form-label">
                  Submitted Report
                </label>
                <select
                  className="w-100"
                  style={{
                    background: "rgba(16, 143, 168, .1)",
                    outline: "none",
                    border: "1px solid #D0D5DD",
                  }}
                  aria-label="Submitted Report"
                  name="reportSubmitted"
                  onChange={(e) => {
                    const value = e.target.value;
                    setReportSubmitted(value);
                    setDropdownFilterValue((prev) => {
                      if (value === "") {
                        // Remove "Report Submitted" from the filter
                        return prev.filter(
                          (item) => !item.startsWith("Report Submitted:")
                        );
                      } else {
                        // Add/Update "Report Submitted" in the filter
                        const updated = prev.filter(
                          (item) => !item.startsWith("Report Submitted:")
                        );
                        return [...updated, `Report Submitted: ${value}`];
                      }
                    });
                    applyFilters({
                      districtName,
                      sectorName,
                      userName,
                      startDate: dateRangeState[0].startDate
                        ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
                        : "",
                      endDate: dateRangeState[0].endDate
                        ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
                        : "",
                      reportSubmitted: e.target.value,
                      reportGenerated,
                    });
                  }}
                  disabled={searchTerm ? true : false}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">NO</option>
                </select>
              </div>
            )}
            {keys.includes("fileGenrated") && (
              <div className="col mb-3 text-start">
                <label htmlFor="reportGenerated" className="form-label">
                  Report Generated
                </label>
                <select
                  className="w-100"
                  style={{
                    background: "rgba(16, 143, 168, .1)",
                    outline: "none",
                    border: "1px solid #D0D5DD",
                  }}
                  aria-label="Report Generated"
                  name="reportGenerated"
                  onChange={(e) => {
                    const value = e.target.value;
                    setReportGenerated(value);
                    setDropdownFilterValue((prev) => {
                      if (value === "") {
                        // Remove "Report Generated" from the filter
                        return prev.filter(
                          (item) => !item.startsWith("Report Generated:")
                        );
                      } else {
                        // Add/Update "Report Generated" in the filter
                        const updated = prev.filter(
                          (item) => !item.startsWith("Report Generated:")
                        );
                        return [...updated, `Report Generated: ${value}`];
                      }
                    });
                    applyFilters({
                      districtName,
                      sectorName,
                      userName,
                      startDate: dateRangeState[0].startDate
                        ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
                        : "",
                      endDate: dateRangeState[0].endDate
                        ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
                        : "",
                      reportSubmitted,
                      reportGenerated: e.target.value,
                    });
                  }}
                  disabled={searchTerm ? true : false}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">NO</option>
                </select>
              </div>
            )}
          </div>
          <div className={`col p-0 ${isExpanded && "d-none"}`}>
            <ul className="list-group p-0">
              <li
                className="list-group-item border-0 bg-transparent cursor-pointer mb-3"
                onClick={toggleSidenav}
              >
                <FaSearch className="img-fluid" />
              </li>
              {keys.includes("districtName") && (
                <li
                  className="list-group-item border-0 bg-transparent cursor-pointer mb-3"
                  onClick={toggleSidenav}
                >
                  <Image
                    className="img-fluid"
                    src="/icons/districtBlack.svg"
                    alt="districtBlack"
                    width={20}
                    height={20}
                  />
                </li>
              )}
              {keys.includes("visitStartDate") && (
                <li
                  className="list-group-item border-0 bg-transparent cursor-pointer mb-3"
                  onClick={toggleSidenav}
                >
                  <MdOutlineDateRange className="img-fluid" />
                </li>
              )}
              {keys.includes("sectorName") && (
                <li
                  className="list-group-item border-0 bg-transparent cursor-pointer mb-3"
                  onClick={toggleSidenav}
                >
                  <FaRegClock className="img-fluid" />
                </li>
              )}
              {keys.includes("userName") && (
                <li
                  className="list-group-item border-0 bg-transparent cursor-pointer mb-3"
                  onClick={toggleSidenav}
                >
                  <FaUser className="img-fluid" />
                </li>
              )}
              {keys.includes("deadline") && (
                <li
                  className="list-group-item border-0 bg-transparent cursor-pointer mb-3"
                  onClick={toggleSidenav}
                >
                  <Image
                    className="img-fluid"
                    src="/icons/submittedReport.svg"
                    alt="dates"
                    width={20}
                    height={20}
                  />
                </li>
              )}
              {keys.includes("fileGenrated") && (
                <li
                  className="list-group-item border-0 bg-transparent cursor-pointer mb-3"
                  onClick={toggleSidenav}
                >
                  <Image
                    className="img-fluid"
                    src="/icons/generatedReport.svg"
                    alt="dates"
                    width={20}
                    height={20}
                  />
                </li>
              )}
            </ul>
          </div>
        </div>
        <div
          className={`${styles.mainContent} ${
            isExpanded ? styles.shiftRight : ""
          } flex-grow-1 p-3 pt-0 border border-white table-responsive`}
          style={{
            borderRadius: "10px",
            background: "#CFE6F8",
            marginTop: "0px",
          }}
        >
          <table
            id="my-table"
            className="table mb-5 "
            style={{
              border: ".41px solid rgba(159, 159, 159, 0.75) !important",
            }}
          >
            <thead>
              <tr>
                <th
                  colSpan={11}
                  className="p-0 me-3 text-center text-white rounded bg-color-sea-blue"
                >
                  <div className="row d-flex m-0">
                    <div className="col m-auto text-start">
                      {/* <ImCross /> */}
                    </div>
                    <div className="col" style={{ marginTop: "10px" }}>
                      <p
                        className="m-0 fs12px fw-bold"
                        style={{ letterSpacing: 1 }}
                      >
                        List of {label}
                      </p>
                    </div>
                    <div className="col d-flex justify-content-end mt-1 mb-1">
                      {/* <Dropdown>
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                          Downloads&nbsp;
                          <Image
                            src={downloadLineBlack}
                            alt="download"
                            width={12}
                            height={15}
                          />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            className="text-center"
                            onClick={() =>
                              tableRows &&
                              exportToPDF(columns, tableRows, new Date(), label)
                            }
                          >
                            PDF&nbsp;
                            <Image src={pdf} alt="pdf" width={24} height={24} />
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-center"
                            onClick={exportToExcel}
                          >
                            Excel&nbsp;
                            <Image
                              src={excel}
                              alt="excel"
                              width={24}
                              height={24}
                            />
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown> */}
                      <DownloadDropDown
                        onClickPdf={() =>
                          tableRows &&
                          exportToPDF(columns, tableRows, new Date(), label)
                        }
                        onClickExcel={exportToExcel}
                      />
                    </div>
                  </div>
                </th>
              </tr>
              <tr>
                <th colSpan={11} className="p-0">
                  <div className="row m-0 d-flex justify-content-between p-3">
                    <div className="col-lg-6 col-md-5 col-sm-12">
                      <p>
                        Showing:{" "}
                        <span className="fw-bold">
                          {searchTerm || dropdownFilterValue.length > 0
                            ? `${filteredData.length}/${filteredData.length}`
                            : projectsData?.length}{" "}
                          {label}
                        </span>
                      </p>
                    </div>
                  </div>
                </th>
              </tr>
              <tr
                className={`color-dark-blue cursor-pointer ${inter.className}`}
                style={{
                  border: ".41px solid rgba(159, 159, 159, 0.75) !important",
                  fontSize: ".85rem",
                }}
              >
                {keys.map((k, i) => (
                  <TableHeading
                    key={k + i}
                    name={
                      k.toLowerCase() === "id"
                        ? "GIS No."
                        : k.toLowerCase() === "visitcount"
                        ? "no. of visits"
                        : k.toLowerCase() === "visitstartdate"
                        ? "Date Range"
                        : k.toLowerCase() === "filegenrated"
                        ? "report generated"
                        : formatKeyName(k)
                    }
                    handleSort={() => handleSort(`${k}`)}
                  />
                ))}
                {/* <TableHeading
                  name="project Name"
                  handleSort={() => handleSort("projectName")}
                />
                <TableHeading
                  name="sector Name"
                  handleSort={() => handleSort("sectorName")}
                />
                <TableHeading
                  name="district Name"
                  handleSort={() => handleSort("districtName")}
                />
                <TableHeading
                  name="no. of Visits"
                  handleSort={() => handleSort("visitCount")}
                />
                <TableHeading
                  name="user Name"
                  handleSort={() => handleSort("userName")}
                />
                <TableHeading
                  name="report Completion"
                  handleSort={() => handleSort("reportCompletion")}
                />
                <TableHeading
                  name="visit Date"
                  handleSort={() => handleSort("visitStartDate")}
                />
                <TableHeading
                  name="completed Date"
                  handleSort={() => handleSort("completedDate")}
                />
                <TableHeading
                  name="deadline"
                  handleSort={() => handleSort("deadline")}
                />
                <TableHeading
                  name="report generated"
                  handleSort={() => handleSort("fileGenrated")}
                /> */}
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((d, i) => (
                <tr
                  key={i}
                  className={`fs13px ${dmSans.className}`}
                  style={{
                    border: ".41px solid rgba(81,81,81,0.20) !important",
                  }}
                >
                  {keys.map((key) => {
                    if (key === "visitStartDate") {
                      // Handle visitStartDate and visitEndDate together
                      return (
                        <td key="visitDates">
                          {d.visitStartDate && d.visitEndDate ? (
                            <>
                              {addDayToFormattedDate(
                                getFormattedDate(
                                  new Date(d.visitStartDate),
                                  "short"
                                )!
                              )}
                              <div className="text-center">TO</div>
                              {addDayToFormattedDate(
                                getFormattedDate(
                                  new Date(d.visitEndDate),
                                  "short"
                                )!
                              )}
                            </>
                          ) : d.visitStartDate ? (
                            addDayToFormattedDate(
                              getFormattedDate(
                                new Date(d.visitStartDate),
                                "short"
                              )!
                            )
                          ) : (
                            ""
                          )}
                        </td>
                      );
                    }

                    // For other keys
                    return (
                      <td key={key}>
                        {key === "projectName" && allowLink ? (
                          <Button
                            className="btn w-100 p-0 text-start shadow-none color-sea-blue cursor-pointer"
                            style={{ textDecoration: "underline" }}
                            onClick={() => handleProjectSubmit(d.id, d.visitId)}
                          >
                            {d[key]}
                          </Button>
                        ) : key === "reportCompletion" ? (
                          <ProjectReportOverviewModal
                            value={d[key]}
                            id={d.id}
                            visitId={d.visitId}
                          />
                        ) : key === "completedDate" ? (
                          addDayToFormattedDate(
                            getFormattedDate(new Date(d[key]), "short")!
                          )
                        ) : key === "deadline" ? (
                          d.reportStatus &&
                          d.reportStatus.toLowerCase() === "yes" ? (
                            "Submitted"
                          ) : (
                            <span
                              className={`text-wrap ${
                                getTimeLeft(d[key]).includes("-")
                                  ? "text-danger"
                                  : ""
                              }`}
                            >
                              {getTimeLeft(d[key]).replace("-", "")}
                            </span>
                          )
                        ) : (
                          d[key]
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {keys.includes("cost") && (
                <tr className="bg-color-sea-blue text-light">
                  <td className="rounded-start text-center" colSpan={4}>
                    Total
                  </td>
                  <td className="text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce((sum, d) => sum + (d.cost || 0), 0)
                    )}{" "}
                    M
                  </td>
                  <td className="text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce(
                        (sum, d) => sum + (d.revisedAllocation || 0),
                        0
                      )
                    )}{" "}
                    M
                  </td>
                  <td className="text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce(
                        (sum, d) => sum + (d.pnDReleases || 0),
                        0
                      )
                    )}{" "}
                    M
                  </td>
                  <td className="rounded-end text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce(
                        (sum, d) => sum + (d.utilization || 0),
                        0
                      )
                    )}{" "}
                    M
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={11} className="p-0">
                  <div className="row d-flex mb-3 m-0">
                    <div className="col-lg-6 col-md-3 col-sm-12 mt-2">
                      {/* Display the current range and total */}
                      {indexOfFirstRow + 1} -{" "}
                      {Math.min(indexOfLastRow, projectsData.length)} of{" "}
                      {projectsData.length}
                    </div>
                    <div className="col-lg-6 col-md-9 col-sm-12">
                      <div className="row d-flex m-0 me-2 justify-content-end align-items-center">
                        <div className="col-lg-2 col-md-1 col"></div>
                        <div className="col-lg-5 col-md-4 col text-end">
                          <label
                            htmlFor="rowPerPage"
                            className="form-label mt-2"
                          >
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
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={11} className="p-0">
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProjectsTable;
