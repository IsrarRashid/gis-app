"use client";
import { deleteUserAPI, registerUserAPI } from "@/app/APIs";
import DeleteModal2 from "@/app/components/DeleteModal2";
import TableHeading from "@/app/components/TableHeading";
import useAuthentication, {
  Authentication,
} from "@/app/hooks/useAuthentication";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { sort } from "fast-sort";
import { DM_Sans, Inter } from "next/font/google";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Form from "./Form";
// import GroupingForm from "./GroupingForm";
import Loader from "@/app/components/Loader";
import Pagination from "@/app/components/Table/Pagination";
import TableHeader from "@/app/components/Table/TableHeader";
import useRoles from "@/app/hooks/useRoles";
import GroupingForm from "./GroupingForm";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({ subsets: ["latin"] });

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Option {
  id: number;
  name: string;
}

const List = ({ refresh, setRefresh }: ListProps) => {
  const { data, setData, setError, error, isLoading } = useAuthentication({
    refresh,
  });
  const { data: roles } = useRoles({ refresh });
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Authentication[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const lowercasedFilter = searchTerm.toLowerCase();

    const filtered = data.filter((item) =>
      [
        item.id.toString(),
        item.userName,
        item.designation,
        item.email,
        item.phoneNumber,
      ]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(e.target.value.toLowerCase()))
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
    handleSearch(e);
  };

  const handleDelete = async (userName: string) => {
    try {
      await apiClient.delete(`${deleteUserAPI}?UserName=${userName}`);
      // remove the deleted item from the data array
      setData((prevData) =>
        prevData.filter((item) => item.userName !== userName)
      );
      notifyCreate(deleteMessage);
      console.log("item deleted successfully");
    } catch (err) {
      console.error("failed to delete item", err);
      setError((err as AxiosError).message);
      notifyError((err as AxiosError).message);
    }
  };

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Authentication;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Authentication) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    const sortedData = sort(data)[direction](key);
    setSortConfig({ key, direction });
    setData([...sortedData]);
  };

  // for selecting rows per page
  const [rows, setRows] = useState(10); // Default to 11 rows per page
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  // Paginate data to display only the current page's rows
  const paginatedData = (searchTerm ? filteredData : data).slice(
    (currentPage - 1) * rows,
    currentPage * rows
  );

  return (
    <>
      {isLoading && <Loader />}
      <TableHeader
        heading="Users"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <Form
              api={registerUserAPI}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
            />
          </div>
        }
      />
      <div className="table-responsive">
        <table
          className="table mb-5"
          style={{ border: ".41px solid rgba(81,81,81,0.20) !important" }}
        >
          <thead>
            <tr
              className={`color-dark-blue cursor-pointer ${inter.className}`}
              style={{
                border: ".41px solid rgba(81,81,81,0.20) !important",
                fontSize: ".85rem",
              }}
            >
              <TableHeading name="id" handleSort={() => handleSort("id")} />
              <TableHeading
                name="username"
                handleSort={() => handleSort("userName")}
              />
              <TableHeading
                name="picture"
                handleSort={() => handleSort("picture")}
              />
              <TableHeading
                name="designation"
                handleSort={() => handleSort("designation")}
              />
              <TableHeading
                name="email"
                handleSort={() => handleSort("email")}
              />
              <TableHeading
                name="phoneNumber"
                handleSort={() => handleSort("phoneNumber")}
              />
              <th>ROLE</th>
              <th colSpan={2}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((d) => (
              <tr
                className={dmSans.className}
                style={{
                  border: ".41px solid rgba(81,81,81,0.20) !important",
                  fontSize: ".85rem",
                }}
                key={d.id}
              >
                <td>{d.id}</td>
                <td>{d.userName}</td>
                <td>
                  {d.picture && (
                    <img
                      className="img-fluid rounded-circle shadow-sm"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        objectPosition: "center top",
                      }}
                      src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.picture}`}
                      alt="picture"
                    />
                  )}
                </td>
                <td>{d.designation}</td>
                <td>{d.email}</td>
                <td>{d.phoneNumber}</td>
                <td>
                  <GroupingForm
                    id={d.id}
                    options={roles}
                    userName={d.userName}
                  />
                </td>
                <td>
                  <DeleteModal2
                    handleDelete={handleDelete}
                    userName={d.userName}
                  />
                </td>

                {/* <td>
                  <Form
                    api={userAPI}
                    method="PUT"
                    id={d.id}
                    setRefresh={setRefresh}
                    refresh={refresh}
                  />
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          searchTerm={searchTerm}
          filteredData={filteredData}
          data={data}
          rows={rows}
          setRows={setRows}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <ToastContainer />
      </div>
    </>
  );
};

export default List;
