"use client";
import Button from "@/app/components/Button";
import TableHeading from "@/app/components/TableHeading";
import DownloadDropDown from "@/app/components/UserDropDown/DownloadDropDown";
import ProjectReportOverviewModal from "@/app/dashboard/components/projectReportOverview/ProjectReportOverviewModal";
import useDistrict from "@/app/hooks/useDistrict";
import useSectors from "@/app/hooks/useSectors";
import useUsers from "@/app/hooks/useUsers";
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
import { DM_Sans, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS
import { FaRegClock, FaSearch, FaUser } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
  MdOutlineDateRange,
} from "react-icons/md";
import Select, { SingleValue, StylesConfig } from "react-select";
import styles from "./ProjectsTable.module.css";

// Define the type of the range state
interface RangeType {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
}

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
  allowLink?: boolean;
}

interface Option {
  label: string;
  value: string;
}

interface NumberOption {
  label: string;
  value: number;
}

const ProjectsTable = ({
  projectsData,
  setProjectsData,
  label,
  keys,
  allowLink = true,
}: Props) => {
  const [refresh, setRefresh] = useState(false);
  const { data: districts } = useDistrict({ refresh });
  const { data: sectors } = useSectors({ refresh });
  const { data: users } = useUsers({ refresh });

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

  const defaultOption = { value: "", label: "Select" };

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

  return (
    <div className="d-flex">
      <div className={`${styles.sidenav} ${isExpanded ? styles.expanded : ""}`}>
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
        {/* <div style={{ height: "96vh", overflow: "hidden" }}> */}
        {/* <ScrollWrapper> */}
        <div style={{ height: "96vh" }}>
          <table
            id="my-table"
            className="table table-hover mb-5 "
            style={{
              border: ".41px solid rgba(159, 159, 159, 0.75) !important",
            }}
          >
            <thead>
              <tr>
                <th
                  colSpan={keys?.length}
                  className="p-0 text-center text-white rounded bg-color-sea-blue"
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
                <th colSpan={keys?.length} className="p-0">
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
                className={`color-dark-blue cursor-pointer text-center ${inter.className}`}
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
                  className={`fs13px text-center ${dmSans.className}`}
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
                        </td>
                      );
                    }
                    if (key === "deadline") {
                      const submittedTime = new Date(d.submittedDate);
                      const deadlineTime = new Date(d.deadline);

                      return (
                        <td key="deadline">
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
                        </td>
                      );
                    }
                    // For other keys
                    return (
                      <td key={key}>
                        {key === "projectName" &&
                        allowLink &&
                        d.reportStatus !== 0 &&
                        d.reportStatus !== 1 &&
                        d.reportStatus !== 2 ? (
                          <Link
                            target="_blank"
                            href={`/project-details-dashboard/${d.id}/${d.visitId}`}
                            className="text-start color-sea-blue"
                          >
                            {d[key]}
                          </Link>
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
                      </td>
                    );
                  })}
                </tr>
              ))}
              {keys.includes("cost") && (
                <tr className="bg-color-sea-blue text-light text-center">
                  <td className="rounded-start" colSpan={4}>
                    Total
                  </td>
                  <td className="text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce((sum, d) => sum + (d.cost || 0), 0)
                    )}
                  </td>
                  <td className="text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce(
                        (sum, d) => sum + (d.revisedAllocation || 0),
                        0
                      )
                    )}
                  </td>
                  <td className="text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce(
                        (sum, d) => sum + (d.pnDReleases || 0),
                        0
                      )
                    )}
                  </td>
                  <td className="rounded-end text-nowrap">
                    {formatAmountWithCommas(
                      projectsData.reduce(
                        (sum, d) => sum + (d.utilization || 0),
                        0
                      )
                    )}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              )}
              <tr>
                <td colSpan={keys.length} className="p-0">
                  <div className="row d-flex mb-2 m-0">
                    <div className="col-lg-6 col-md-3 col-sm-12 mt-2">
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
                </td>
              </tr>
              <tr>
                <td colSpan={keys?.length} className="p-0">
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
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          {/* </ScrollWrapper> */}
        </div>
      </div>
    </div>
  );
};

export default ProjectsTable;
