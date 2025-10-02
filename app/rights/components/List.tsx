"use client";
import { RIGHT_API } from "@/app/APIs";
import DeleteModal from "@/app/components/DeleteModal";
import Loader from "@/app/components/Loader";
import Pagination from "@/app/components/Table/Pagination";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import useRights, { Right } from "@/app/hooks/useRights";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getFormattedDate } from "@/app/utils";
import { sort } from "fast-sort";
import { DM_Sans, Inter } from "next/font/google";
import { useState } from "react";
import { toast } from "react-toastify";
import Form from "./Form";
import RowHeader from "@/app/components/Table/RowHeader";
import TableData from "@/app/components/Table/TableData";
import Actions from "@/app/components/Table/Actions";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({ subsets: ["latin"] });

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const List = ({ refresh, setRefresh }: ListProps) => {
  const { data, setData, setError, error, isLoading } = useRights({ refresh });
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Right[]>([]);

  // Handle search logic
  const handleSearch = (value: string) => {
    // const lowercasedFilter = searchTerm.toLowerCase();

    const filtered = data.filter((item) =>
      [item.rightId.toString(), item.rightName, item.rightIdentifier]
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

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${RIGHT_API}/${id}`);
      // remove the deleted item from the data array
      setData((prevData) => prevData.filter((item) => item.rightId !== id));
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
    key: keyof Right;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Right) => {
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
        heading="Rights"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <Form
              api={RIGHT_API}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
            />
          </div>
        }
      />
      <div className="table-responsive mb-2" style={{ margin: "0px -12px" }}>
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <TableHeading
                name="right id"
                handleSort={() => handleSort("rightId")}
                className="text-nowrap"
              />
              <TableHeading
                name="right name"
                handleSort={() => handleSort("rightName")}
                className="text-nowrap"
              />
              <TableHeading
                name="right Identifier"
                handleSort={() => handleSort("rightIdentifier")}
                className="text-nowrap"
              />
              <TableHeading
                name="created At"
                handleSort={() => handleSort("createdAt")}
                className="text-nowrap"
              />
              <TableHeading
                name="updated At"
                handleSort={() => handleSort("updatedAt")}
                className="text-nowrap"
              />
              <TableHeading name="ACTIONS" textClassName="text-center" />
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((d) => (
              <tr key={d.rightId}>
                <RowHeader>{d.rightId}</RowHeader>
                <TableData>{d.rightName}</TableData>
                <TableData>{d.rightIdentifier}</TableData>
                <TableData>
                  {d.createdAt &&
                    getFormattedDate(new Date(d.createdAt), "short")}
                </TableData>
                <TableData>
                  {d.updatedAt &&
                    getFormattedDate(new Date(d.updatedAt), "short")}
                </TableData>
                <TableData>
                  <Actions
                    deleteNode={
                      <DeleteModal handleDelete={handleDelete} id={d.rightId} />
                    }
                    formNode={
                      <Form
                        api={RIGHT_API}
                        method="PUT"
                        id={d.rightId}
                        setRefresh={setRefresh}
                        refresh={refresh}
                      />
                    }
                  />
                </TableData>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        rows={rows}
        setRows={setRows}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default List;
