"use client";
import { GENERATE_REPORT_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomInput from "@/app/components/Form/CustomInput";
import CustomSelect, {
  defaultOption,
  OptionType,
} from "@/app/components/Form/CustomSelect";
import { paginationSelectStyles } from "@/app/components/Table/Pagination";
import RowHeader from "@/app/components/Table/RowHeader";
import TableData from "@/app/components/Table/TableData";
import TableHeading from "@/app/components/Table/TableHeading";
import DownloadDropDown from "@/app/components/UserDropDown/DownloadDropDown";
import ProjectReportOverviewModal from "@/app/dashboard/components/projectReportOverview/ProjectReportOverviewModal";
import { District } from "@/app/hooks/useDistrict";
import { Sector } from "@/app/hooks/useSectors";
import { User } from "@/app/hooks/useUsers";
import apiClient, { AxiosError } from "@/app/services/api-client";
import {
  addDayToFormattedDate,
  displayStatusText,
  exportToPDF,
  formatAmountWithCommas,
  getFormattedDate,
  getTimeLeft,
} from "@/app/utils";
import { exportDataToExcel } from "@/app/utils/exportToExcel";
import { format } from "date-fns";
import { sort } from "fast-sort";
import { Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS
import { FiSearch } from "react-icons/fi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoSearch, IoSearchOutline } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { PiCircleFill } from "react-icons/pi";
import { VscCheckAll } from "react-icons/vsc";
import Select, { SingleValue, StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { ReportTypeStatusEnum } from "../../types/reportTypeStatus";
import styles from "./ProjectsTable.module.css";

// Define the type of the range state
interface RangeType {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
}

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

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
  statusDate: string;
  cost: number;
  revisedAllocation: number;
  pnDReleases: number;
  visitCount: number;
  utilization: number;
  utilPercent: number;
  expUpToJune: number;
  totalRevenueCost: number;
  totalCapitalCost: number;
  reportStatus: number;
}

interface DefaultFilter {
  districtName: string;
  sectorName: string;
  userName: string;
  startDate: string; // Start date for  range
  endDate: string; // End date for  range
  reportStatus: string;
}

interface Props {
  projectsData: ProjectsList[];
  setProjectsData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
  label: string;
  keys: (keyof ProjectsList)[];
  role: string;
  districts: District[];
  sectors: Sector[];
  users: User[];
  allowLink?: boolean;
}

interface Option {
  label: string;
  value: string;
}

const ProjectsTable = ({
  projectsData,
  setProjectsData,
  label,
  keys,
  districts,
  sectors,
  users,
  allowLink = true,
  role = "",
}: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);

  const customStyles: StylesConfig<Option, false> = {
    control: (base) => ({
      ...base,
      fontSize: "14px",
      backgroundColor: "rgba(16, 143, 168, .1)",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      // backgroundColor: state.isFocused ? "#f0f0f0" : "white",
      // color: "#333",
      fontSize: "14px",
    }),
  };

  const districtOptions = districts.map((district) => {
    return {
      value: district.districtName,
      label: district.districtName,
    };
  });

  const handleDistrictChange = (selectedOption: SingleValue<Option>) => {
    setDistrictName(selectedOption?.value);
    setDropdownFilterValue((prev) => {
      if (selectedOption?.value === "") {
        // Remove "District Name" from the filter
        return prev.filter((item) => !item.startsWith("District Name:"));
      } else {
        // Add/Update "District Name" in the filter
        const updated = prev.filter(
          (item) => !item.startsWith("District Name:")
        );
        return [...updated, `District Name: ${selectedOption?.value}`];
      }
    });
    applyFilters({
      districtName: selectedOption?.value,
      sectorName,
      userName,
      startDate: dateRangeState[0].startDate
        ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
        : "",
      endDate: dateRangeState[0].endDate
        ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
        : "",
      reportStatus: reportStatus,
    });
    console.log(`Option selected:`, selectedOption);
  };

  const sectorOptions = sectors.map((sector) => {
    return {
      value: sector.name,
      label: sector.name,
    };
  });

  const handleSectorChange = (selectedOption: SingleValue<Option>) => {
    setSectorName(selectedOption?.value);
    setDropdownFilterValue((prev) => {
      if (selectedOption?.value === "") {
        // Remove "Sector Name" from the filter
        return prev.filter((item) => !item.startsWith("Sector Name:"));
      } else {
        // Add/Update "Sector Name" in the filter
        const updated = prev.filter((item) => !item.startsWith("Sector Name:"));
        return [...updated, `Sector Name: ${selectedOption?.value}`];
      }
    });
    applyFilters({
      districtName,
      sectorName: selectedOption?.value,
      userName,
      startDate: dateRangeState[0].startDate
        ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
        : "",
      endDate: dateRangeState[0].endDate
        ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
        : "",
      reportStatus: reportStatus,
    });
    console.log(`Option selected:`, selectedOption);
  };

  const userOptions = users.map((user) => {
    return {
      value: user.name,
      label: user.name,
    };
  });

  const handleUserChange = (selectedOption: SingleValue<Option>) => {
    setUserName(selectedOption?.value);
    setDropdownFilterValue((prev) => {
      if (selectedOption?.value === "") {
        // Remove "User Name" from the filter
        return prev.filter((item) => !item.startsWith("User Name:"));
      } else {
        // Add/Update "User Name" in the filter
        const updated = prev.filter((item) => !item.startsWith("User Name:"));
        return [...updated, `User Name: ${selectedOption?.value}`];
      }
    });
    applyFilters({
      districtName,
      sectorName,
      userName: selectedOption?.value,
      startDate: dateRangeState[0].startDate
        ? format(dateRangeState[0].startDate, "yyyy-MM-dd")
        : "",
      endDate: dateRangeState[0].endDate
        ? format(dateRangeState[0].endDate, "yyyy-MM-dd")
        : "",
      reportStatus: reportStatus,
    });
    console.log(`Option selected:`, selectedOption);
  };

  const defaultNumberOption = { value: "-1", label: "Select" };

  const reportStatusOptions = [
    { value: "0", label: "SCHEDULED" },
    { value: "1", label: "COMPLETED" },
    { value: "2", label: "CANCELLED" },
    { value: "3", label: "SUBMITTED" },
    { value: "4", label: "APPROVED" },
    { value: "5", label: "REFERBACK" },
    { value: "6", label: "ISSUED" },
  ];

  const handleReportStatusChange = (selectedOption: SingleValue<Option>) => {
    const value = Number(selectedOption?.value);
    setReportStatus(value);
    setDropdownFilterValue((prev) => {
      if (value === -1) {
        // Remove "Report Status" from the filter
        return prev.filter((item) => !item.startsWith("Report Status:"));
      } else {
        // Add/Update "Report Status" in the filter
        const updated = prev.filter(
          (item) => !item.startsWith("Report Status:")
        );
        return [...updated, `Report Status: ${value}`];
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
      reportStatus: value,
    });
    console.log(`Option selected:`, selectedOption);
  };

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<ProjectsList[]>([]);
  const [paginatedData, setPaginatedData] = useState<ProjectsList[]>([]);
  const [dropdownFilterValue, setDropdownFilterValue] = useState<string[]>([]);

  // Handle search logic
  const handleSearch = (value: string) => {
    // const lowercasedFilter = searchTerm.toLowerCase();

    const filtered = projectsData.filter((item) =>
      [
        item.gSno,
        item.projectName,
        item.sectorName,
        item.districtName,
        item.userName,
        item.designation,
      ]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(value.toLowerCase()))
    );
    setFilteredData(filtered);
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

  // const handleRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setRows(parseInt(e?.target.value, 10));
  //   setCurrentPage(1);
  // };

  const handleRowsPerPage = (count: number) => {
    setRows(count);
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
  // const [utilizationPercentage, setUtilizationPercentage] = useState<any[]>([]);

  // useEffect(() => {
  //   if (projectsData) {
  //     const filteredProjects = projectsData?.map((project) => {
  //       const utilizationPercentage =
  //         ((project.expUpToJune + project.utilization) / project.cost) * 100;
  //       setUtilizationPercentage((prev) => [...prev, utilizationPercentage]);
  //     });
  //   }
  // }, [projectsData]);

  // Paginate data to display only the current page's rows
  useEffect(() => {
    console.log("projectsDataX:", projectsData);
    if (projectsData) {
      const paginatedData = (
        searchTerm || dropdownFilterValue.length > 0
          ? filteredData
          : projectsData
      ).slice((currentPage - 1) * rows, currentPage * rows);

      setPaginatedData(paginatedData);
    }
  }, [
    projectsData,
    searchTerm,
    dropdownFilterValue,
    filteredData,
    currentPage,
    rows,
  ]);

  // const handleProjectSubmit = async (projectId: number, visitId: number) => {
  //   try {
  //     const response = await apiClient.get(
  //       `${SINGLE_PROJECT_DASHBOARD_API}?projectid=${projectId}&visit=${visitId}`
  //     );
  //     if (
  //       (response.data.data && response.data.data !== null) ||
  //       response.data.data.groups ||
  //       response.data.data.attributes ||
  //       response.data.data.groups.length > 0 ||
  //       response.data.data.attributes.length > 0
  //     ) {
  //       window.open(
  //         `/project-details-dashboard/${projectId}/${visitId}`,
  //         "_blank"
  //       );
  //       // router.push(`/projectDetailsDashboard/${projectId}/${visitId}`);
  //     } else {
  //       toast.error("This Project is not yet Monitored.");
  //     }
  //   } catch (err) {
  //     console.error("Submission error:", err);
  //     toast.error("This Project is not yet Monitored.");
  //   }
  // };

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
    gSno: "GS No.",
    projectName: "PROJECT NAME",
    districtName: "DISTRICT NAME",
    sectorName: "SECTOR NAME",
    userName: "USER NAME",
    reportCompletion: "REPORT COMPLETION",
    fileGenrated: "REPORT GENERATED",
    visitStartDate: "DATE RANGE",
    completedDate: "COMPLETED DATE",
    deadline: "DEADLINE",
    visitCount: "No. OF VISITS",
    cost: "COST (M)",
    revisedAllocation: "REVISED ALLOCATION (M)",
    pnDReleases: "PN D RELEASES (M)",
    utilization: "EXPENDITURE + UTILIZATION (M)",
    utilPercent: "UTIL. PERCENT",
    reportStatus: "REPORT STATUS",
    // Add other mappings as needed
  };

  // Helper function to rename columns dynamically
  const formatKeyName = (key: string): string => {
    return renameMap[key] || key.replace(/([A-Z])/g, " $1").toUpperCase();
  };

  const deadlineColumnValue = (submittedDate: string, deadlineDate: string) => {
    const submittedTime = new Date(submittedDate);
    const deadlineTime = new Date(deadlineDate);

    const diffInMilliseconds = submittedTime.getTime() - deadlineTime.getTime();

    const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30); // Approximate months
    const diffInYears = Math.floor(diffInDays / 365); // Approximate years
    const result =
      submittedTime <= deadlineTime
        ? "Submitted on time"
        : diffInYears >= 1 && diffInMonths >= 12
        ? `${diffInYears} year${diffInYears > 1 ? "s" : ""} Late Submitted`
        : diffInMonths >= 1
        ? `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} Late Submitted`
        : `${diffInDays} day${diffInDays > 1 ? "s" : ""} Late Submitted`;

    return result;
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
        case "gSno":
          row[key] = data.gSno;
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
            )} to ${
              data.visitEndDate &&
              addDayToFormattedDate(
                getFormattedDate(new Date(data.visitEndDate), "short")!
              )
            }`;
          break;
        case "completedDate":
          row[key] = data.completedDate
            ? `${addDayToFormattedDate(
                getFormattedDate(new Date(data.completedDate), "short")!
              )}`
            : "NA";
          break;
        case "utilization":
          row[key] = `${data.utilization + data.expUpToJune}`;
          break;
        case "utilPercent":
          row[key] = `${data.utilPercent}%`;
          break;
        case "deadline":
          if (data.submittedDate && data.deadline) {
            row[key] = deadlineColumnValue(data.submittedDate, data.deadline);
          } else if (data.deadline) {
            row[key] = getTimeLeft(data.deadline).replace("-", "");
          } else {
            row[key] = "NA";
          }

          break;
        case "reportStatus":
          row[key] = displayStatusText(data.reportStatus);
          break;
        case "statusDate":
          row[key] = data.statusDate
            ? `${addDayToFormattedDate(
                getFormattedDate(new Date(data.statusDate), "short")!
              )}`
            : "NA";
          break;
        default:
          row[key] = data[key]; // Handle any additional keys dynamically
      }
    });

    return row;
  });

  // Export to Excel function
  const exportToExcel = () => {
    const headers = ["srNo", ...keys]; // Rename headers dynamically
    const displayHeaders = headers.map(formatKeyName);
    const data = (
      searchTerm || dropdownFilterValue.length > 0 ? filteredData : projectsData
    ).map((item: any, index) => {
      const row: Record<string, any> = {};

      headers.forEach((header) => {
        const key =
          Object.entries(renameMap).find(
            ([, value]) => value === header
          )?.[0] || header; // Find original key from renamed header

        switch (key) {
          case "srNo":
            row[formatKeyName(header)] = index + 1;
            break;
          case "gSno":
            row[formatKeyName(header)] = item.gSno;
            break;
          case "projectName":
            row[formatKeyName(header)] = item.projectName;
            break;
          case "districtName":
            row[formatKeyName(header)] = item.districtName;
            break;
          case "sectorName":
            row[formatKeyName(header)] = item.sectorName;
            break;
          case "userName":
            row[
              formatKeyName(header)
            ] = `${item.userName} (${item.designation})`;
            break;
          case "reportCompletion":
            row[formatKeyName(header)] = `${Math.round(
              item.reportCompletion
            )}%`;
            break;
          case "visitStartDate":
            row[formatKeyName(header)] =
              item.visitStartDate &&
              `${addDayToFormattedDate(
                getFormattedDate(new Date(item.visitStartDate), "short")!
              )} to ${
                item.visitEndDate &&
                addDayToFormattedDate(
                  getFormattedDate(new Date(item.visitEndDate), "short")!
                )
              }`;
            break;
          case "completedDate":
            row[formatKeyName(header)] = item.completedDate
              ? `${addDayToFormattedDate(
                  getFormattedDate(new Date(item.completedDate), "short")!
                )}`
              : "NA";
            break;
          case "deadline":
            if (item.deadline && item.submittedDate) {
              row[formatKeyName(header)] = deadlineColumnValue(
                item.submittedDate,
                item.deadline
              );
            } else if (item.deadline) {
              row[formatKeyName(header)] = getTimeLeft(item.deadline).replace(
                "-",
                ""
              );
            } else {
              row[formatKeyName(header)] = "NA";
            }
            break;
          case "visitCount":
            row[formatKeyName(header)] = item.visitCount;
            break;
          case "cost":
            row[formatKeyName(header)] = item.cost;
            break;
          case "revisedAllocation":
            row[formatKeyName(header)] = item.revisedAllocation;
            break;
          case "pnDReleases":
            row[formatKeyName(header)] = item.pnDReleases;
            break;
          case "utilization":
            row[formatKeyName(header)] = `${
              item.utilization + item.expUpToJune
            }`;
            break;
          case "utilPercent":
            row[formatKeyName(header)] = `${item.utilPercent}%`;
            break;
          case "reportStatus":
            row[formatKeyName(header)] = displayStatusText(item.reportStatus);
            break;
          case "statusDate":
            row[formatKeyName(header)] = item.statusDate
              ? `${addDayToFormattedDate(
                  getFormattedDate(new Date(item.statusDate), "short")!
                )}`
              : "NA";
            break;

          default:
            row[formatKeyName(header)] = item[formatKeyName(key)] || ""; // Handle any additional keys dynamically
        }
      });

      return row;
    });

    exportDataToExcel(
      data,
      displayHeaders,
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
        <div className="col p-0" key="ellipsis-start">
          <Button
            className="btn btn-sm bg-color-evaluation-theme-blue rounded-circle text-white border-0 d-flex justify-content-center align-items-center"
            disabled
            style={{
              width: "27px",
              height: "27px",
              padding: 0, // remove extra padding from btn-sm
            }}
          >
            <HiOutlineDotsHorizontal />
          </Button>
        </div>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <div key={i} className="col p-0">
          <Button
            className={`btn btn-sm rounded-circle border-0 d-flex justify-content-center align-items-center shadow-none fs-6 ${
              i === currentPage
                ? " fw-bold mb-2 color-dark-gray"
                : "fw-6 color-evaluation-theme-blue"
            }`}
            onClick={() => handlePageChange(i)}
            style={{
              width: "27px",
              height: "27px",
              padding: 0, // remove extra padding from btn-sm
            }}
          >
            {i}
          </Button>
        </div>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <div className="col p-0" key="ellipsis-end">
          <Button
            className="btn btn-sm bg-color-evaluation-theme-blue rounded-circle text-white border-0 d-flex justify-content-center align-items-center"
            disabled
            style={{
              width: "27px",
              height: "27px",
              padding: 0, // remove extra padding from btn-sm
            }}
          >
            <HiOutlineDotsHorizontal />
          </Button>
        </div>
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
  const [reportStatus, setReportStatus] = useState<number>();

  const applyFilters = ({
    districtName = "",
    sectorName = "",
    userName = "",
    startDate = "", // Start date for  range
    endDate = "", // End date for  range
    reportStatus = -1,
  }) => {
    let filtered = projectsData;
    console.log("data on filter is applyed", filtered);
    console.log("selected districtName", districtName);
    console.log(
      "filter data against districtName",
      filtered.filter(
        (project) =>
          project.districtName &&
          project.districtName.toLowerCase() === districtName.toLowerCase()
      )
    );

    // Filter by district name
    if (districtName) {
      filtered = filtered.filter(
        (project) =>
          project.districtName &&
          project.districtName.toLowerCase() === districtName.toLowerCase()
      );
    }

    // Filter by sector name
    if (sectorName) {
      filtered = filtered.filter(
        (project) =>
          project.sectorName &&
          project.sectorName.toLowerCase() === sectorName.toLowerCase()
      );
    }

    // Filter by userName
    if (userName) {
      filtered = filtered.filter(
        (project) =>
          project.userName &&
          project.userName.toLowerCase().includes(userName.toLowerCase())
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((project) => {
        if (!project.visitStartDate) return false;
        const projectDate = new Date(project.visitStartDate); // Ensure project date is a Date object
        const start = new Date(startDate); // Parse start date
        const end = new Date(endDate); // Parse end date

        // Check if projectDate is within the selected range
        return projectDate >= start && projectDate <= end;
      });
    }

    // Filter by report submitted
    if (
      reportStatus &&
      reportStatus !== null &&
      reportStatus !== undefined &&
      reportStatus !== -1
    ) {
      filtered = filtered.filter(
        (project) => project.reportStatus === reportStatus
      );
    }

    // Update the filtered data state
    setFilteredData(filtered);
    console.log("filtered select Data,", filtered);
    console.log("dropdownFilterValue", dropdownFilterValue);
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
      reportStatus: reportStatus,
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

  const reportPdfDownload = async (
    visitId: number,
    projectId: number,
    reportTypeRequest: number
  ) => {
    try {
      const response = await apiClient.post(
        `${GENERATE_REPORT_API}/GetReportPath`,
        {
          visitId,
          projectId,
          reportTypeRequest,
        }
      );

      console.log("response", response);

      const fileUrl = process.env.NEXT_PUBLIC_BACKEND_API + response.data.data; // API should return full URL or relative path

      if (fileUrl) {
        // Trigger download
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.error(err);
      toast.error((err as AxiosError).message);
    }
  };

  const rowCounts = [10, 20, 30, 40, 50];
  const rowCountOptions: OptionType[] = rowCounts.map((d) => {
    return {
      value: d.toString(),
      label: d.toString(),
    };
  });

  useEffect(() => {
    setSelectedOptions([rowCountOptions[0]]);
    handleRowsPerPage(parseInt(rowCountOptions[0].value));
  }, []);

  return (
    <div className={`d-flex ${plusJakartaSans.className}`}>
      <div
        className={`${styles.sidenav} ${isExpanded ? styles.expanded : ""}`}
        style={{ borderRight: "1px solid #CBD5E1", zIndex: 3 }}
      >
        <ul className="list-group p-0" style={{ marginBottom: "29.71px" }}>
          <li className="list-group-item border-0 bg-transparent p-0">
            <Button
              className="btn"
              onClick={toggleSidenav}
              aria-label="Toggle navigation"
            >
              <Image src="/icons/box.svg" alt="box" width={22} height={22} />
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
              <Select
                options={[defaultOption, ...districtOptions]}
                name="districtName"
                id="districtName"
                isClearable
                isSearchable
                styles={customStyles}
                menuPlacement="auto"
                menuPosition="absolute"
                menuPortalTarget={document.body}
                onChange={(
                  newValue: SingleValue<{ value: string; label: string }>
                ) => {
                  if (newValue) {
                    handleDistrictChange(newValue);
                  }
                }}
              />
              {/* <select
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
                      reportStatus,
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
                </select> */}
            </div>
          )}
          {keys.includes("visitStartDate") && (
            <div
              className="col mb-3 text-start"
              style={{ pointerEvents: `${searchTerm ? "none" : "auto"}` }}
            >
              <label className="form-label">Date Range</label>
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
                        // className={styles.customDateRange}
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
                            reportStatus: reportStatus,
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
              <Select
                options={[defaultOption, ...sectorOptions]}
                name="sectorName"
                id="sectorName"
                isClearable
                isSearchable
                menuPlacement="auto"
                menuPosition="absolute"
                menuPortalTarget={document.body}
                styles={customStyles}
                onChange={(
                  newValue: SingleValue<{ value: string; label: string }>
                ) => {
                  if (newValue) {
                    handleSectorChange(newValue);
                  }
                }}
              />
              {/* <select
                id="sectorName"
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
                    reportStatus: reportStatus,
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
              </select> */}
            </div>
          )}
          {keys.includes("userName") && (
            <div className="col mb-3 text-start">
              <label htmlFor="userName" className="form-label">
                UserName
              </label>
              <Select
                options={[defaultOption, ...userOptions]}
                name="userName"
                id="userName"
                isClearable
                isSearchable
                menuPlacement="auto"
                menuPosition="absolute"
                menuPortalTarget={document.body}
                styles={customStyles}
                onChange={(
                  newValue: SingleValue<{ value: string; label: string }>
                ) => {
                  if (newValue) {
                    handleUserChange(newValue);
                  }
                }}
              />
              {/* <select
                id="userName"
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
                    reportStatus: reportStatus,
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
              </select> */}
            </div>
          )}
          {keys.includes("deadline") && (
            <div className="col mb-3 text-start">
              <label htmlFor="reportStatus" className="form-label">
                Report Status
              </label>
              <Select
                options={[defaultNumberOption, ...reportStatusOptions]}
                name="reportStatus"
                id="reportStatus"
                isClearable
                isSearchable
                menuPlacement="auto"
                menuPosition="absolute"
                menuPortalTarget={document.body}
                styles={customStyles}
                onChange={(
                  newValue: SingleValue<{ value: string; label: string }>
                ) => {
                  if (newValue) {
                    handleReportStatusChange(newValue);
                  }
                }}
              />
              {/* <select
                id="reportStatus"
                className="w-100"
                style={{
                  background: "rgba(16, 143, 168, .1)",
                  outline: "none",
                  border: "1px solid #D0D5DD",
                }}
                aria-label="Report Status"
                name="reportStatus"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setReportStatus(value);
                  setDropdownFilterValue((prev) => {
                    if (value === -1) {
                      // Remove "Report Status" from the filter
                      return prev.filter(
                        (item) => !item.startsWith("Report Status:")
                      );
                    } else {
                      // Add/Update "Report Status" in the filter
                      const updated = prev.filter(
                        (item) => !item.startsWith("Report Status:")
                      );
                      return [...updated, `Report Status: ${value}`];
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
                    reportStatus: Number(e.target.value),
                  });
                }}
                disabled={searchTerm ? true : false}
              >
                <option value="-1">Select</option>
                <option value="0">SCHEDULED</option>
                <option value="1">COMPLETED</option>
                <option value="2">CANCELLED</option>
                <option value="3">SUBMITTED</option>
                <option value="4">APPROVED</option>
                <option value="5">REFERBACK</option>
                <option value="6">ISSUED</option>
              </select> */}
            </div>
          )}
        </div>
        <div className={`col p-0 ${isExpanded && "d-none"}`}>
          <ul className="list-group p-0" style={{ marginBottom: "18.57px" }}>
            <li
              className="list-group-item border-0 bg-transparent cursor-pointer p-0"
              style={{ marginBottom: "14.86px" }}
              onClick={toggleSidenav}
            >
              {/* <FaSearch className="img-fluid" /> */}
              <div
                className="d-flex justify-content-center align-items-center rounded-circle bg-white"
                style={{
                  width: "44.57px",
                  height: "44.57px",
                }}
              >
                <FiSearch size={22} style={{ color: "#475569" }} />
              </div>
            </li>
          </ul>
          <ul className="list-group p-0">
            {keys.includes("districtName") && (
              <li
                className="list-group-item border-0 bg-transparent cursor-pointer p-0"
                style={{ marginBottom: "23.21px" }}
                onClick={toggleSidenav}
              >
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    width: "44.57px",
                    height: "44.57px",
                  }}
                >
                  <Image
                    className="img-fluid"
                    src="/icons/city-01.svg"
                    alt="city-01"
                    width={22}
                    height={22}
                  />
                </div>
              </li>
            )}
            {keys.includes("visitStartDate") && (
              <li
                className="list-group-item border-0 bg-transparent cursor-pointer p-0"
                style={{ marginBottom: "23.21px" }}
                onClick={toggleSidenav}
              >
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    width: "44.57px",
                    height: "44.57px",
                  }}
                >
                  <Image
                    className="img-fluid"
                    src="/icons/calendar-02.svg"
                    alt="calendar-02"
                    width={22}
                    height={22}
                  />
                </div>
              </li>
            )}
            {keys.includes("sectorName") && (
              <li
                className="list-group-item border-0 bg-transparent cursor-pointer p-0"
                style={{ marginBottom: "23.21px" }}
                onClick={toggleSidenav}
              >
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    width: "44.57px",
                    height: "44.57px",
                  }}
                >
                  <Image
                    className="img-fluid"
                    src="/icons/setup-01.svg"
                    alt="setup-01"
                    width={22}
                    height={22}
                  />
                </div>
              </li>
            )}
            {keys.includes("userName") && (
              <li
                className="list-group-item border-0 bg-transparent cursor-pointer p-0"
                style={{ marginBottom: "23.21px" }}
                onClick={toggleSidenav}
              >
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    width: "44.57px",
                    height: "44.57px",
                  }}
                >
                  <LuUserRound size={22} style={{ color: "#475569" }} />
                </div>
              </li>
            )}
            {keys.includes("deadline") && (
              <li
                className="list-group-item border-0 bg-transparent cursor-pointer p-0"
                style={{ marginBottom: "23.21px" }}
                onClick={toggleSidenav}
              >
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    width: "44.57px",
                    height: "44.57px",
                  }}
                >
                  <VscCheckAll size={22} style={{ color: "#475569" }} />
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div
        className={`${styles.mainContent} ${
          isExpanded ? styles.shiftRight : ""
        } flex-grow-1 p-3 pt-0 bg-white`}
        style={{
          borderTopRightRadius: "13.93px",
          borderBottomRightRadius: "13.93px",
          marginTop: "0px",
          border: "1px solid #CBD5E1",
          borderLeft: "0px",
        }}
      >
        {/* <div style={{ height: "96vh", overflow: "hidden" }}> */}
        {/* <ScrollWrapper> */}

        <div
          className="row d-flex align-items-center"
          style={{ padding: "17.33px 26px" }}
        >
          <div className="col p-0">
            <div className="row align-items-center">
              <div className="col-auto mb-1 mb-lg-0">
                <h4 className="m-0" style={{ fontWeight: 800 }}>
                  {label}
                </h4>
              </div>
              <div className="col-auto mb-2 mb-lg-0">
                <span
                  className="badge rounded-pill fs13px fw-6"
                  style={{ color: "#1C6BA6", border: "1.08px solid #1C6BA6" }}
                >
                  <div className="row align-items-center">
                    <div className="col-auto pe-0">
                      <PiCircleFill
                        size={8}
                        style={{ color: "#1C6BA6", marginBottom: "2px" }}
                      />
                    </div>
                    <div className="col ps-1">
                      {searchTerm || dropdownFilterValue.length > 0
                        ? filteredData.length
                        : projectsData?.length}{" "}
                      {label}
                    </div>
                  </div>
                </span>
              </div>
            </div>
          </div>

          {handleChange && (
            <div className="col-12 col-sm-12 col-md-5 col-lg-4 col-xl-3">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <button
                    className="btn rounded-end rounded-pill text-white shadow-none border-end-0 pe-0"
                    type="submit"
                    style={{
                      border: "1.08px solid #CBD5E1",
                    }}
                  >
                    <IoSearchOutline size={21.6} style={{ color: "#475569" }} />
                  </button>
                  <CustomInput
                    type="text"
                    className="form-control fw-bold border-start-0 rounded-pill rounded-start shadow-none fs15px bg-transparent py-2 placeholder-bold"
                    style={{
                      border: "1px solid #CBD5E1",
                    }}
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleChange}
                    id="search"
                  />
                </div>
              </form>
            </div>
          )}
          <div className="col-auto">
            <DownloadDropDown
              onClickPdf={() =>
                tableRows && exportToPDF(columns, tableRows, new Date(), label)
              }
              onClickExcel={exportToExcel}
            />
          </div>
        </div>
        {/* <TableHeader
          heading={label}
          searchTerm={searchTerm}
          filteredData={filteredData}
          data={projectsData}
          handleChange={dropdownFilterValue.length > 0 ? undefined : handleChange}
          form={
            <div className="col-auto">
              <DownloadDropDown
                onClickPdf={() =>
                  tableRows &&
                  exportToPDF(columns, tableRows, new Date(), label)
                }
                onClickExcel={exportToExcel}
              />
            </div>
          }
        /> */}
        <div className="table-responsive mb-2" style={{ margin: "0px -17px" }}>
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                {keys.map((k, i) => (
                  <TableHeading
                    className="text-nowrap"
                    key={k + i}
                    name={
                      k.toLowerCase() === "id"
                        ? "ID"
                        : k.toLowerCase() === "gSno"
                        ? "GS NO."
                        : k.toLowerCase() === "visitcount"
                        ? "no. of visits"
                        : k.toLowerCase() === "visitstartdate"
                        ? "Date Range"
                        : k.toLowerCase() === "filegenrated"
                        ? "report generated"
                        : k.toLowerCase() === "statusDate"
                        ? "status Date"
                        : formatKeyName(k)
                    }
                    handleSort={() => handleSort(`${k}`)}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((d, i) => (
                <tr key={i}>
                  {keys.map((key) => {
                    if (key === "gSno") {
                      // Handle visitStartDate and visitEndDate together
                      return <RowHeader key="gSno">{d.gSno}</RowHeader>;
                    }
                    if (key === "visitStartDate") {
                      // Handle visitStartDate and visitEndDate together
                      return (
                        <TableData key="visitDates">
                          {d.visitStartDate && d.visitEndDate ? (
                            <>
                              {addDayToFormattedDate(
                                getFormattedDate(
                                  new Date(d.visitStartDate),
                                  "short"
                                )!
                              )}
                              <div className="text-center">to</div>
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
                            "NA"
                          )}
                        </TableData>
                      );
                    }
                    if (key === "deadline") {
                      const submittedTime = new Date(d.submittedDate);
                      const deadlineTime = new Date(d.deadline);

                      return (
                        <TableData key="deadline">
                          {d.deadline && d.submittedDate ? (
                            <>
                              <div
                                className={`text-center ${
                                  submittedTime <= deadlineTime
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                              >
                                {deadlineColumnValue(
                                  d.submittedDate,
                                  d.deadline
                                )}
                              </div>
                            </>
                          ) : d.deadline ? (
                            <span
                              className={`text-wrap ${
                                getTimeLeft(d.deadline).includes("-")
                                  ? "text-danger"
                                  : ""
                              }`}
                            >
                              {getTimeLeft(d.deadline).replace("-", "")}
                            </span>
                          ) : (
                            "NA"
                          )}
                        </TableData>
                      );
                    }
                    // For other keys
                    return (
                      <TableData key={key}>
                        {key === "projectName" &&
                        d.reportStatus !== 0 &&
                        d.reportStatus !== 1 &&
                        d.reportStatus !== 2 ? (
                          <>
                            {role === "Special Role" ? (
                              // Special Role handling based on tile
                              label === "Projects" ? (
                                // Just plain text for first 2 tiles
                                <p className="text-start">{d[key]}</p>
                              ) : (
                                // PDF click for remaining tiles
                                <div
                                  className="text-start color-sea-blue cursor-pointer"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    reportPdfDownload(
                                      d.visitId,
                                      d.id,
                                      ReportTypeStatusEnum.MONITORING
                                    );
                                  }}
                                >
                                  {d[key]}
                                </div>
                              )
                            ) : allowLink ? (
                              // Default: show link if allowed
                              <Link
                                target="_blank"
                                href={`/project-details-dashboard/${d.id}/${d.visitId}`}
                                className="text-start color-sea-blue"
                              >
                                {d[key]}
                              </Link>
                            ) : (
                              // Fallback plain text
                              <p className="text-start">{d[key]}</p>
                            )}
                          </>
                        ) : key === "reportCompletion" ? (
                          <ProjectReportOverviewModal
                            value={d[key]}
                            id={d.id}
                            visitId={d.visitId}
                          />
                        ) : key === "utilization" ? (
                          <>{d.utilization + d.expUpToJune}</>
                        ) : key === "utilPercent" ? (
                          <>
                            <span className="text-danger">
                              {d.utilPercent}%
                            </span>
                          </>
                        ) : key === "completedDate" ? (
                          d[key] ? (
                            addDayToFormattedDate(
                              getFormattedDate(new Date(d[key]), "short")!
                            )
                          ) : (
                            "NA"
                          )
                        ) : key === "statusDate" ? (
                          d[key] ? (
                            addDayToFormattedDate(
                              getFormattedDate(new Date(d[key]), "short")!
                            )
                          ) : (
                            "NA"
                          )
                        ) : key === "reportStatus" ? (
                          <>{displayStatusText(d[key])}</>
                        ) : (
                          d[key]
                        )}
                      </TableData>
                    );
                  })}
                </tr>
              ))}
              {keys.includes("cost") && (
                <>
                  <tr className="bg-color-sea-blue">
                    <RowHeader className="rounded-start text-light" colSpan={4}>
                      Total
                    </RowHeader>
                    <TableData className="text-light">
                      {formatAmountWithCommas(
                        paginatedData.reduce((sum, d) => sum + (d.cost || 0), 0)
                      )}
                    </TableData>
                    <TableData className="text-light">
                      {formatAmountWithCommas(
                        paginatedData.reduce(
                          (sum, d) => sum + (d.revisedAllocation || 0),
                          0
                        )
                      )}
                    </TableData>
                    <TableData className="text-light">
                      {formatAmountWithCommas(
                        paginatedData.reduce(
                          (sum, d) => sum + (d.pnDReleases || 0),
                          0
                        )
                      )}
                    </TableData>
                    <TableData className="rounded-end text-light">
                      {formatAmountWithCommas(
                        paginatedData.reduce(
                          (sum, d) => sum + (d.utilization || 0),
                          0
                        )
                      )}
                    </TableData>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                  <tr className="bg-color-sea-blue">
                    <RowHeader className="rounded-start text-light" colSpan={4}>
                      Grand Total
                    </RowHeader>
                    <TableData className="text-light">
                      {formatAmountWithCommas(
                        projectsData.reduce((sum, d) => sum + (d.cost || 0), 0)
                      )}
                    </TableData>
                    <TableData className="text-light">
                      {formatAmountWithCommas(
                        projectsData.reduce(
                          (sum, d) => sum + (d.revisedAllocation || 0),
                          0
                        )
                      )}
                    </TableData>
                    <TableData className="text-light">
                      {formatAmountWithCommas(
                        projectsData.reduce(
                          (sum, d) => sum + (d.pnDReleases || 0),
                          0
                        )
                      )}
                    </TableData>
                    <TableData className="rounded-end text-light">
                      {formatAmountWithCommas(
                        projectsData.reduce(
                          (sum, d) => sum + (d.utilization || 0),
                          0
                        )
                      )}
                    </TableData>
                    <td></td>
                    <td></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
          {/* </ScrollWrapper> */}
        </div>

        <div className="row m-0 justify-content-between align-items-center pb-2">
          <div className="col-auto">
            <div className="row align-items-center">
              <div className="col-auto pe-0 color-evaluation-theme-blue fw-6">
                {indexOfFirstRow + 1} -{" "}
                {Math.min(indexOfLastRow, projectsData.length)} of{" "}
                {projectsData.length}
              </div>
              <div className="col-auto">
                <span
                  className="badge rounded-pill fs13px fw-6 color-evaluation-theme-blue"
                  style={{
                    border: "1.08px solid #1C6BA6",
                    paddingBottom: "2px",
                  }}
                >
                  <div className="row align-items-center">
                    <div
                      className="col-auto pe-0"
                      style={{ paddingBottom: "4px" }}
                    >
                      <PiCircleFill
                        size={8}
                        className="color-evaluation-theme-blue"
                      />
                    </div>
                    <div className="col ps-1 color-evaluation-theme-blue">
                      10
                    </div>
                  </div>
                </span>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <div className="row align-items-center">
              <div className="col ps-0" style={{ paddingRight: "10px" }}>
                <Button
                  className={`btn btn-sm rounded-circle text-white border-0 d-flex justify-content-center align-items-center m-1 ${
                    currentPage === 1
                      ? "bg-color-light-gray "
                      : "bg-color-evaluation-theme-blue"
                  }`}
                  onClick={handleFirstPage}
                  disabled={currentPage === 1}
                  style={{
                    width: "27px",
                    height: "27px",
                    padding: 0, // remove extra padding from btn-sm
                  }}
                >
                  <Image
                    src="/icons/evaluation/doubleArrowLeft.svg"
                    alt="doubleArrowLeft"
                    width={13}
                    height={13}
                  />
                </Button>
              </div>
              <div className="col ps-0" style={{ paddingRight: "10px" }}>
                <Button
                  className={`btn btn-sm rounded-circle text-white border-0 d-flex justify-content-center align-items-center m-1 ${
                    currentPage === 1
                      ? "bg-color-light-gray "
                      : "bg-color-evaluation-theme-blue"
                  }`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  style={{
                    width: "27px",
                    height: "27px",
                    padding: 0, // remove extra padding from btn-sm
                  }}
                >
                  <Image
                    src="/icons/evaluation/singleArrowLeft.svg"
                    alt="singleArrowLeft"
                    width={13}
                    height={13}
                  />
                </Button>
              </div>
              {renderPageNumbers()}
              <div className="col ps-0" style={{ paddingRight: "10px" }}>
                <Button
                  className={`btn btn-sm rounded-circle text-white border-0 d-flex justify-content-center align-items-center m-1 ${
                    currentPage === totalPages
                      ? "bg-color-light-gray "
                      : "bg-color-evaluation-theme-blue"
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  style={{
                    width: "27px",
                    height: "27px",
                    padding: 0, // remove extra padding from btn-sm
                  }}
                >
                  <Image
                    src="/icons/evaluation/singleArrowLeft.svg"
                    alt="singleArrowLeft"
                    width={13}
                    height={13}
                    style={{ rotate: "180deg" }}
                  />
                </Button>
              </div>
              <div className="col ps-0" style={{ paddingRight: "10px" }}>
                <Button
                  className={`btn btn-sm rounded-circle text-white border-0 d-flex justify-content-center align-items-center m-1 ${
                    currentPage === totalPages
                      ? "bg-color-light-gray "
                      : "bg-color-evaluation-theme-blue"
                  }`}
                  onClick={handleLastPage}
                  disabled={currentPage === totalPages}
                  style={{
                    width: "27px",
                    height: "27px",
                    padding: 0, // remove extra padding from btn-sm
                  }}
                >
                  <Image
                    src="/icons/evaluation/doubleArrowLeft.svg"
                    alt="doubleArrowLeft"
                    width={13}
                    height={13}
                    style={{ rotate: "180deg" }}
                  />
                </Button>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <CustomSelect
              menuPlacement="top"
              isClearable={false}
              options={rowCountOptions}
              isSearchable={false}
              closeMenuOnSelect={true}
              singleSelectStyles={paginationSelectStyles}
              value={selectedOptions}
              onChangeSingle={(
                newValue: SingleValue<{ value: string; label: string }>
              ) => {
                if (newValue) {
                  handleRowsPerPage(Number(newValue.value));
                  setSelectedOptions([
                    {
                      label: newValue.label,
                      value: newValue.value,
                    },
                  ]);
                }
              }}
            />
          </div>
        </div>

        {/* <div className="row d-flex mb-2 m-0">
          <div className="col-lg-6 col-md-3 col-sm-12 mt-2">
            {indexOfFirstRow + 1} -{" "}
            {Math.min(indexOfLastRow, projectsData.length)} of{" "}
            {projectsData.length}
          </div>
          <div className="col-lg-6 col-md-9 col-sm-12">
            <div className="row d-flex m-0 me-2 justify-content-end align-items-center">
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
                  id="rowPerPage"
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
        <div className="col text-center">
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
        </div> */}
      </div>
    </div>
  );
};

export default ProjectsTable;
