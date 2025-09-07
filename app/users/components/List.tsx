"use client";
import { DELETE_USER_API, REGISTER_USER_API } from "@/app/APIs";
import DeleteModal2 from "@/app/components/DeleteModal2";
import TableHeading from "@/app/components/Table/TableHeading";
import useAuthentication, {
  Authentication,
} from "@/app/hooks/useAuthentication";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { sort } from "fast-sort";
import { DM_Sans, Inter } from "next/font/google";
import { useState } from "react";
import { toast } from "react-toastify";
import Form from "./Form";
// import GroupingForm from "./GroupingForm";
import Loader from "@/app/components/Loader";
import Pagination from "@/app/components/Table/Pagination";
import TableHeader from "@/app/components/Table/TableHeader";
import useRoles from "@/app/hooks/useRoles";
import GroupingForm from "./GroupingForm";
import Image from "next/image";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
  const { data, setData, setError, isLoading } = useAuthentication({
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
      [item.userName, item.fullName, item.designation, item.email]
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
      await apiClient.delete(`${DELETE_USER_API}?UserName=${userName}`);
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
              api={REGISTER_USER_API}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
              roles={roles}
            />
          </div>
        }
      />
      <div className="table-responsive">
        <table
          className="table table-hover mb-5"
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
                className="text-nowrap"
                name="user name"
                handleSort={() => handleSort("userName")}
              />
              <TableHeading
                className="text-nowrap"
                name="full Name"
                handleSort={() => handleSort("fullName")}
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
                <td>{d.fullName}</td>
                <td>
                  {d.picture && (
                    <a
                      href={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.picture}`}
                      target="_blank"
                    >
                      <img
                        className="rounded-circle shadow-sm"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center top",
                          width: "70px",
                          height: "70px",
                        }}
                        // width={70}
                        // height={70}
                        src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.picture}`}
                        alt="picture"
                      />
                      <Image
                        className="rounded-circle shadow-sm"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center top",
                          width: "70px",
                          height: "70px",
                        }}
                        width={70}
                        height={70}
                        src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.picture}`}
                        alt="picture"
                      />
                    </a>
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
                    api={USER_API}
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
      </div>
    </>
  );
};

export default List;
