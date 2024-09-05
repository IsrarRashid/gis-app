import axios, { CanceledError } from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
export default axios.create({
  baseURL: "http://45.115.86.186:154/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export { CanceledError };
