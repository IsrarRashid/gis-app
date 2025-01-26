"use client";
import { roleAPI } from "@/app/APIs";
import DeleteModal from "@/app/components/DeleteModal";
import Loader from "@/app/components/Loader";
import Pagination from "@/app/components/Table/Pagination";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/TableHeading";
import useRights from "@/app/hooks/useRights";
import useRoles, { Role } from "@/app/hooks/useRoles";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { sort } from "fast-sort";
import { DM_Sans, Inter } from "next/font/google";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Form from "./Form";
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
  rightId: number;
  rightName: string;
}

const List = ({ refresh, setRefresh }: ListProps) => {
  const { data, setData, setError, error, isLoading } = useRoles({ refresh });
  const { data: rights } = useRights({ refresh });
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Role[]>([]);

  // Handle search logic
  const handleSearch = (value: string) => {
    // const lowercasedFilter = searchTerm.toLowerCase();

    const filtered = data.filter((item) =>
      [
        item.id.toString(),
        item.name,
        item.normalizedName,
        item.concurrencyStamp,
      ]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(value.toLowerCase()))
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
    handleSearch(e.target.value);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${roleAPI}/${id}`);
      // remove the deleted item from the data array
      setData((prevData) => prevData.filter((item) => item.id !== id));
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
    key: keyof Role;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Role) => {
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
        heading="Roles"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <Form
              api={roleAPI}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
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
              <TableHeading name="name" handleSort={() => handleSort("name")} />
              <TableHeading
                name="normalized Name"
                handleSort={() => handleSort("normalizedName")}
              />
              <TableHeading
                name="concurrency Stamp"
                handleSort={() => handleSort("concurrencyStamp")}
              />
              <th>RIGHTS</th>
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
                <td>{d.name}</td>
                <td>{d.normalizedName}</td>
                <td>{d.concurrencyStamp}</td>
                <td>
                  <GroupingForm id={d.id} name={d.name} options={rights} />
                </td>
                <td>
                  <DeleteModal handleDelete={handleDelete} id={d.id} />
                </td>
                <td>
                  <Form
                    api={roleAPI}
                    method="PUT"
                    id={d.id}
                    setRefresh={setRefresh}
                    refresh={refresh}
                  />
                </td>
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
