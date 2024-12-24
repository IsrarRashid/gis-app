export const getFormattedDate = (
  date: Date,
  formatType: "short" | "numeric"
) => {
  // Format the date using the appropriate options
  if (formatType === "numeric") {
    // For numeric format: dd-mm-yyyy
    const [month, day, year] = date.toLocaleDateString("en-US").split("/");
    return `${day}.${month}.${year}`;
  } else if (formatType === "short") {
    // For short format: 11-Nov-2024
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
};

// Usage examples
const shortDate = getFormattedDate(new Date(), "short"); // Outputs: "Sep 10, 2024"
const numericDate = getFormattedDate(new Date(), "numeric"); // Outputs: "10.9.2024"

export const getName = (id: number, data: any) => {
  const record = data.find((item: any) => item.id === id);
  if (record?.name) return record?.name;
  if (record?.userName) return record?.userName;
  if (record?.regNumber) return record?.regNumber;
  if (record?.driverName) return record?.driverName;
};

export function formatDateTime(dateTimeString: string, formatType: string) {
  const date = new Date(dateTimeString);

  if (formatType === "time") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } else if (formatType === "date") {
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .toUpperCase()
      .replace(/\//g, "-");
  } else {
    throw new Error("Invalid format type. Use 'time' or 'date'.");
  }
}

export const devMap = false;

// "yyyy-MM-dd" to the desired format "dd-MMM-yyyy"
export function formatHHLStringDate(inputDate: string): string {
  //HHL(High Level Language) - human readable
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Parse the input date string
  const [year, month, day] = inputDate.split("-");

  // Format the date
  const formattedDate = `${parseInt(day)}-${
    months[parseInt(month) - 1]
  }-${year}`;

  return formattedDate;
}

import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaLaptopHouse } from "react-icons/fa";

const renameMap: Record<string, string> = {
  id: "GIS No.",
  fileGenrated: "REPORT GENERATED",
  visitStartDate: "DATE RANGE",
  // Add other mappings as needed
};

export const formatKeyName = (key: string): string => {
  return renameMap[key] || key.replace(/([A-Z])/g, " $1").toUpperCase(); // Default formatting
};

export const exportToPDF = (
  columns: { header: string; dataKey: string }[],
  tableRows: any[],
  selectedDate: Date,
  label: string
) => {
  const doc = new jsPDF("landscape");
  doc.setFont("helvetica", "bold"); // Set font to bold
  doc.setFontSize(16); // Set font size for the heading
  const titleText = `${label} ${
    getFormattedDate(selectedDate, "short") || "today"
  }`;
  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth(titleText);
  const xPosition = (pageWidth - textWidth) / 2;
  doc.text(titleText, xPosition, 10); // Centered title at the top of the page

  // Reset font style for the rest of the content
  doc.setFont("helvetica", "normal"); // Change font back to normal for other text
  doc.setFontSize(10); // Set a smaller font size for the rest of the content

  // Define columns and rows for the PDF table
  // const columns = [
  //   { header: "GS NO", dataKey: "id" },
  //   { header: "Project Name", dataKey: "projectName" },
  // { header: "Sr", dataKey: "userId" },
  // { header: "Name", dataKey: "employeeName" },
  // { header: "Designation", dataKey: "employeeDesignation" },
  // { header: "In Time", dataKey: "punchInTime" },
  // { header: "Punch In", dataKey: "punchInStatus" },
  // { header: "Out Time", dataKey: "punchOutTime" },
  // { header: "Punch Out", dataKey: "punchOutStatus" },
  // ];

  // Map over your attendance data to create rows for the table
  // const trimDataMethod = (designation: any) => {
  //   let updatedText = "";
  //   let trimedText = designation.trim();

  //   for (let i = 0; i < trimedText.length; i++) {
  //     if (i !== trimedText.length - 1) {
  //       updatedText += trimedText[i];
  //     }
  //   }

  //   return updatedText.trim() + ")";
  // };

  // const tableRows =
  //   attendanceData &&
  //   attendanceData?.map((data: any, index: any) => ({
  //     id: index + 1,
  //     projectName: data.projectName,
  // employeeDesignation: trimDataMethod(data.employeeDesignation),
  // punchInTime: data.punchInTime,
  // punchInStatus: data.punchInStatus,
  // punchOutTime: data.punchOutTime,
  // punchOutStatus: data.punchOutStatus,
  // }));

  // Add table to PDF using autoTable plugin
  doc.autoTable({
    columns,
    body: tableRows,
    // startY: 20,
    theme: "grid", // Options: 'grid', 'plain', or 'striped'

    headStyles: {
      fillColor: [12, 140, 233], // Darker background color
      fontSize: 10, // Smaller text size
      fontStyle: "bold", // Bold text
      halign: "center", // Center the text horizontally
      valign: "middle",

      textColor: [255, 255, 255], // Optional: White text for contrast
      lineWidth: 0.2, // Border width for header cells
      lineColor: [255, 255, 255], // Border color as RGB
    },
    styles: {
      fontSize: 8,
      halign: "left", // Horizontal text alignment: 'left', 'center', 'right'
      valign: "middle", // Adjust table body font size if needed
    },
    // columnStyles: {
    //   0: { cellWidth: "auto" }, // First column width set to 30
    //   1: { cellWidth: "auto", halign: "left" }, // Second column width set to 50
    //   2: { cellWidth: 80, overflow: "hidden" }, // Third column auto width
    //   3: { cellWidth: 18, halign: "center" }, // Fourth column width set to 40
    //   4: { cellWidth: "auto", halign: "center" }, // Fourth column width set to 40
    //   5: { cellWidth: 18, halign: "center" }, // Fourth column width set to 40
    //   6: { cellWidth: "auto", halign: "center" }, // Fourth column width set to 40
    // },
  });

  // Save the PDF
  doc.save(
    `${label}_${getFormattedDate(selectedDate, "short") || "today"}.pdf`
  );
};

export const addDayToFormattedDate = (formattedDate: string): string => {
  // Parse the input formatted date
  const [day, month, year] = formattedDate.split("-");
  const dateString = `${month}-${day}-${year}`;

  // Create a Date object
  const date = new Date(dateString);

  // Get the weekday name
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

  // Get the month name
  const monthName = date.toLocaleDateString("en-US", { month: "short" });

  // Construct and return the final string
  return `${weekday}-${day}-${monthName}-${year}`;
};

export const getTimeLeft = (deadline: string): string => {
  const now = new Date();
  const targetDate = new Date(deadline);
  const diffInMs = targetDate.getTime() - now.getTime();

  // if (diffInMs <= 0) {
  //   return "Time's up"; // Deadline has passed
  // }

  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days} ${days === 1 ? "Day" : "Days"} Left`;
  } else if (days < 0) {
    return `${days} ${days === 1 ? "Day" : "Days"} Delayed`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? "Hour" : "Hours"} Left`;
  } else if (hours < 0) {
    return `${hours} ${hours === 1 ? "Hour" : "Hours"} Delayed`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? "Minute" : "Minutes"} Left`;
  } else {
    return `${minutes} ${minutes === 1 ? "Minute" : "Minutes"} Delayed`;
  }
};

// Utility function to calculate "x days ago"
export const getDaysAgo = (targetDate: string) => {
  const today = new Date();
  const givenDate = new Date(targetDate);

  // Calculate the difference in milliseconds
  const differenceInTime = today.getTime() - givenDate.getTime();

  // Convert milliseconds to days
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  // Return a formatted string
  if (differenceInDays === 0) {
    return "Today";
  } else if (differenceInDays === 1) {
    return "Yesterday";
  } else {
    return `${differenceInDays} Days ago`;
  }
};

/**
 * Formats a number by placing commas as thousands separators.
 *
 * @param amount - The number to be formatted.
 * @param decimals - Number of decimal places to retain (default is 2).
 * @returns The formatted amount as a string.
 */
export function formatAmountWithCommas(
  amount: number,
  decimals: number = 3
): string {
  if (isNaN(amount)) {
    throw new Error("Invalid amount. Please provide a valid number.");
  }

  // Convert the number to a fixed decimal string
  const fixedAmount = amount?.toFixed(decimals);

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = fixedAmount.split(".");

  // Add commas to the integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Return the formatted amount with decimals
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

export const renderTinyMCEData = (info: any) => {
  if (info) {
    return <div dangerouslySetInnerHTML={{ __html: info }} />;
  }
  return null;
};

export interface SingleProjectLessData {
  id: number;
  superGroupID: number;
  smdpProjectID: number;
  name: string;
  gsNo: number;
  sectorId: number;
  address: string;
  city: string;
  locationCoordinates: string;
  status: string;
  sectorName: string;
}
