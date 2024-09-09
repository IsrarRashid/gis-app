import { toast } from "react-toastify";

export const getFormattedDate = () => {
  const today = new Date();

  // Define the options with appropriate types
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  // Format the date to "Aug 7, 2024"
  const formattedDate = today.toLocaleDateString("en-US", options);

  // Remove the space after the month to get "{getFormattedDate()}"
  return formattedDate.replace(" ", "");
};

export const notifyCreate = (message: string) => toast.success(message);
export const notifyError = (message: string) => toast.error(message);
