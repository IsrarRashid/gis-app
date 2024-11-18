export const getFormattedDate = (
  date: Date,
  formatType: "short" | "numeric"
) => {
  // Define options for both formats
  const shortOptions: Intl.DateTimeFormatOptions = {
    month: "short", // e.g., "Sep"
    day: "numeric", // e.g., "10"
    year: "numeric", // e.g., "2024"
  };

  const numericOptions: Intl.DateTimeFormatOptions = {
    month: "numeric", // e.g., "9" for September
    day: "numeric", // e.g., "10"
    year: "numeric", // e.g., "2024"
  };

  // Choose the options based on formatType parameter
  const options = formatType === "short" ? shortOptions : numericOptions;

  // Format the date using the chosen options
  const formattedDate = date.toLocaleDateString("en-US", options);

  // If it's "numeric" format, return with dots between day, month, and year
  if (formatType === "numeric") {
    const [month, day, year] = formattedDate.split("/");
    return `${month}.${day}.${year}`;
  }

  // For "short" format, return as is (e.g., "Sep 10, 2024")
  return formattedDate;
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
