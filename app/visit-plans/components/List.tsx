"use client";
import { TOUR_PLAN_API } from "@/app/APIs";
import DeleteModal from "@/app/components/DeleteModal";
import Loader from "@/app/components/Loader";
import Pagination from "@/app/components/Table/Pagination";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import useTourPlans, { TourPlan } from "@/app/hooks/useTourPlans";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getFormattedDate } from "@/app/utils";
import { sort } from "fast-sort";
import { DM_Sans, Inter } from "next/font/google";
import { useState } from "react";
import { toast } from "react-toastify";
import Form from "./Form";
import useAuthentication from "@/app/hooks/useAuthentication";
import RowHeader from "@/app/components/Table/RowHeader";
import TableData from "@/app/components/Table/TableData";
import Actions from "@/app/components/Table/Actions";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({ subsets: ["latin"] });

interface Props {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const List = ({ refresh, setRefresh }: Props) => {
  const { data, setData, setError, isLoading } = useTourPlans({ refresh });
  const { data: users } = useAuthentication({ refresh });

  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<TourPlan[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      [item.id.toString(), item.name]
        .filter((field) => field) // Remove undefined fields
        .map((field) => field.toLowerCase())
        .some((field) => field.includes(e.target.value.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e);
  };

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TourPlan;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof TourPlan) => {
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

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${TOUR_PLAN_API}/${id}`);
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

  return (
    <>
      {isLoading && <Loader />}
      <TableHeader
        heading="Visit Plans"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <Form
              api={TOUR_PLAN_API}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
              setData={setData}
              users={users}
            />
          </div>
        }
      />
      <div className="table-responsive mb-2" style={{ margin: "0px -12px" }}>
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <TableHeading name="id" handleSort={() => handleSort("id")} />
              <TableHeading name="name" handleSort={() => handleSort("name")} />
              <TableHeading
                name="tour Start Date"
                className="text-nowrap"
                handleSort={() => handleSort("tourStartDate")}
              />
              <TableHeading
                name="tour End Date"
                className="text-nowrap"
                handleSort={() => handleSort("tourEndDate")}
              />
              <TableHeading
                name="approval Date"
                className="text-nowrap"
                handleSort={() => handleSort("approvalDate")}
              />
              <TableHeading
                name="created Date"
                className="text-nowrap"
                handleSort={() => handleSort("createdDate")}
              />
              <TableHeading
                name="updated Date"
                className="text-nowrap"
                handleSort={() => handleSort("updatedDate")}
              />
              <TableHeading
                name="created By"
                className="text-nowrap"
                handleSort={() => handleSort("createdBy")}
              />
              <TableHeading
                name="updated By"
                className="text-nowrap"
                handleSort={() => handleSort("updatedBy")}
              />
              <TableHeading name="ACTIONS" textClassName="text-center" />
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((d) => (
              <tr key={d.id}>
                <RowHeader>{d.id}</RowHeader>
                <TableData>{d.name}</TableData>
                <TableData>
                  {d.tourStartDate &&
                    getFormattedDate(new Date(d.tourStartDate), "short")}
                </TableData>
                <TableData>
                  {d.tourEndDate &&
                    getFormattedDate(new Date(d.tourEndDate), "short")}
                </TableData>
                <TableData>
                  {d.approvalDate &&
                    getFormattedDate(new Date(d.approvalDate), "short")}
                </TableData>
                <TableData>
                  {d.createdDate &&
                    getFormattedDate(new Date(d.createdDate), "short")}
                </TableData>
                <TableData>
                  {d.updatedDate &&
                    getFormattedDate(new Date(d.updatedDate), "short")}
                </TableData>
                <TableData>
                  {users.find((user) => user.id === d.createdBy)?.fullName}
                </TableData>
                <TableData>
                  {users.find((user) => user.id === d.updatedBy)?.fullName}
                </TableData>
                <TableData>
                  <Actions
                    deleteNode={
                      <DeleteModal handleDelete={handleDelete} id={d.id} />
                    }
                    formNode={
                      <Form
                        api={TOUR_PLAN_API}
                        method="PUT"
                        id={d.id}
                        setRefresh={setRefresh}
                        refresh={refresh}
                        setData={setData}
                        users={users}
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
