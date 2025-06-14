"use client";
import { vehicleApi } from "@/app/APIs";
import DeleteModal from "@/app/components/DeleteModal";
import Loader from "@/app/components/Loader";
import Pagination from "@/app/components/Table/Pagination";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/TableHeading";
import useVehicle, { Vehicle } from "@/app/hooks/useVehicle";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getFormattedDate } from "@/app/utils";
import { sort } from "fast-sort";
import { DM_Sans, Inter } from "next/font/google";
import { useState } from "react";
import { toast } from "react-toastify";
import Form from "./Form";

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
  const { data, setData, error, setError, isLoading } = useVehicle({
    refresh,
  });

  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Vehicle[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const lowercasedFilter = searchTerm.toLowerCase();

    const filtered = data.filter((item) =>
      [
        item.id.toString(),
        item.color,
        item.fuelType,
        item.description,
        item.model,
        item.name,
        item.seatsCapacity.toString(),
        item.trasnmission,
        item.vehicleNumber,
      ]
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
    key: keyof Vehicle;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Vehicle) => {
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

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${vehicleApi}/${id}`);
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
      <>
        {isLoading && <Loader />}
        <TableHeader
          heading="Vehicles"
          searchTerm={searchTerm}
          filteredData={filteredData}
          data={data}
          handleChange={handleChange}
          form={
            <div className="col-auto">
              <Form
                api={vehicleApi}
                method="POST"
                setRefresh={setRefresh}
                refresh={refresh}
              />
            </div>
          }
        />
      </>
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
                name="description"
                handleSort={() => handleSort("description")}
              />
              <TableHeading
                name="vehicle Number"
                handleSort={() => handleSort("vehicleNumber")}
              />
              <TableHeading
                name="model"
                handleSort={() => handleSort("model")}
              />
              <TableHeading
                name="color"
                handleSort={() => handleSort("color")}
              />
              <TableHeading
                name="transmission"
                handleSort={() => handleSort("trasnmission")}
              />
              <TableHeading
                name="seats Capacity"
                handleSort={() => handleSort("seatsCapacity")}
              />
              <TableHeading
                name="fuel Type"
                handleSort={() => handleSort("fuelType")}
              />
              <TableHeading
                name="vehicle Image"
                handleSort={() => handleSort("vehicleImage")}
              />
              <TableHeading
                name="vehicle Icon"
                handleSort={() => handleSort("vehicleIcon")}
              />
              <TableHeading
                name="created at"
                handleSort={() => handleSort("createdAt")}
              />
              <TableHeading
                name="updated at"
                handleSort={() => handleSort("updatedAt")}
              />
              <th colSpan={2}>
                <div className="text-center"></div>
              </th>
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
                <td>{d.description}</td>
                <td>{d.vehicleNumber}</td>
                <td>{d.model}</td>
                <td>{d.color}</td>
                <td>{d.trasnmission}</td>
                <td>{d.seatsCapacity}</td>
                <td>{d.fuelType}</td>
                <td className="text-center">
                  {d.vehicleImage && (
                    <img
                      className="img-fluid rounded-3"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "contain",
                      }}
                      src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.vehicleImage}`}
                      alt="vehicleImage"
                    />
                  )}
                </td>
                <td className="text-center">
                  {d.vehicleIcon && (
                    <img
                      className="img-fluid rounded-circle"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "contain",
                      }}
                      src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.vehicleIcon}`}
                      alt="vehicleIcon"
                    />
                  )}
                </td>
                <td>
                  {d.createdAt &&
                    getFormattedDate(new Date(d.createdAt), "short")}
                </td>
                <td>
                  {d.updatedAt &&
                    getFormattedDate(new Date(d.updatedAt), "short")}
                </td>
                <td>
                  <DeleteModal handleDelete={handleDelete} id={d.id} />
                </td>
                <td>
                  <Form
                    api={vehicleApi}
                    method="PUT"
                    id={d.id}
                    setRefresh={setRefresh}
                    refresh={refresh}
                  />
                </td>
              </tr>
            ))}

            <tr style={{ border: "0px solid transparent" }}>
              <td colSpan={15}>
                <Pagination
                  searchTerm={searchTerm}
                  filteredData={filteredData}
                  data={data}
                  rows={rows}
                  setRows={setRows}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default List;
