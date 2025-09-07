"use client";
import { SECTOR_API } from "@/app/APIs";
import DeleteModal from "@/app/components/DeleteModal";
import Loader from "@/app/components/Loader";
import Pagination from "@/app/components/Table/Pagination";
import RowHeader from "@/app/components/Table/RowHeader";
import TableData from "@/app/components/Table/TableData";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/Table/TableHeading";
import useSectors, { Sector } from "@/app/hooks/useSectors";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getFormattedDate } from "@/app/utils";
import { sort } from "fast-sort";
import { Inter } from "next/font/google";
import { useState } from "react";
import { toast } from "react-toastify";
import SectorForm from "./SectorForm";

const inter = Inter({ subsets: ["latin"] });

interface SectorsTableProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const SectorsTable = ({ refresh, setRefresh }: SectorsTableProps) => {
  const { data, setData, setError, isLoading } = useSectors({ refresh });
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Sector[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      [item.id.toString(), item.name, item.description, item.sortId.toString()]
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
    key: keyof Sector;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Sector) => {
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

  const getParentSector = (parsentSectorId: number, data: Sector[]) => {
    const sector = data.find((sector) => sector.id === parsentSectorId);
    return sector?.name;
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${SECTOR_API}/${id}`);
      // remove the deleted item from the data array
      // seTableDataata((prevData) => prevData.filter((item) => item.id !== id));
      setRefresh((prev) => !prev);
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
        heading="Sectors"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <SectorForm
              api={SECTOR_API}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
              setData={setData}
              data={data}
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
                name="description"
                handleSort={() => handleSort("description")}
              />
              <TableHeading
                className="text-nowrap"
                name="parent sector"
                handleSort={() => handleSort("parentId")}
              />
              <TableHeading
                className="text-nowrap"
                name="sort id"
                handleSort={() => handleSort("sortId")}
              />
              <TableHeading
                className="text-nowrap"
                name="created at"
                handleSort={() => handleSort("createdAt")}
              />
              <TableHeading
                className="text-nowrap"
                name="update at"
                handleSort={() => handleSort("updateAt")}
              />
              <th
                style={{
                  background: "#F8FAFC",
                  borderBottom: "1.08px solid #CBD5E1",
                  padding: "15.17px 26px",
                }}
              ></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((d) => (
              <tr key={d.id}>
                <RowHeader>{d.id}</RowHeader>
                <TableData>{d.name}</TableData>
                <TableData>{d.description}</TableData>
                <TableData>{getParentSector(d.parentId, data)}</TableData>
                <TableData className="text-center">{d.sortId}</TableData>
                <TableData>
                  {d.createdAt &&
                    getFormattedDate(new Date(d.createdAt), "short")}
                </TableData>
                <TableData>
                  {d.updateAt &&
                    getFormattedDate(new Date(d.updateAt), "short")}
                </TableData>
                <TableData>
                  <div className="col p-0">
                    <div className="row d-flex flex-nowrap justify-content-center">
                      <div className="col p-0">
                        <DeleteModal handleDelete={handleDelete} id={d.id} />
                      </div>
                      <div className="col p-0">
                        <SectorForm
                          api={SECTOR_API}
                          method="PUT"
                          id={d.id}
                          setRefresh={setRefresh}
                          refresh={refresh}
                          setData={setData}
                          data={data}
                        />
                      </div>
                    </div>
                  </div>
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

export default SectorsTable;
