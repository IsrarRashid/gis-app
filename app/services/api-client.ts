import axios, { CanceledError, AxiosError } from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export { CanceledError, AxiosError };
