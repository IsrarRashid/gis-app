import * as XLSX from "xlsx";

/**
 * Exports data to an Excel file.
 * @param data - The data to export.
 * @param headers - The column headers for the Excel file.
 * @param filename - The name of the Excel file (e.g., "data.xlsx").
 */

export const exportDataToExcel = (
  data: Record<string, any>[],
  headers: string[],
  filename: string
) => {
  // Create a worksheet
  const worksheetData = [
    headers, // Add renamed headers as the first row
    ...data.map((row) => headers.map((header) => row[header])), // Populate data using renamed headers
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook to a file
  XLSX.writeFile(workbook, filename);
};
