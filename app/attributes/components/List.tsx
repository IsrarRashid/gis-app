"use client";
import { attributesAPI, getProjectDetailKeysAPI } from "@/app/APIs";
import DeleteModal from "@/app/components/DeleteModal";
import Loader from "@/app/components/Loader";
import Pagination from "@/app/components/Table/Pagination";
import TableHeader from "@/app/components/Table/TableHeader";
import TableHeading from "@/app/components/TableHeading";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { getFormattedDate } from "@/app/utils";
import { sort } from "fast-sort";
import { DM_Sans, Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAttributes, { Attribute } from "../../hooks/useAttributes";
import Form from "./Form";

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
  const { data, setData, setError, error, isLoading } = useAttributes({
    refresh,
  });
  const deleteMessage = "Deleted Successfully!";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Attribute[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const lowercasedFilter = searchTerm.toLowerCase();

    const filtered = [...(data || [])].reverse().filter((item) =>
      [
        item.attributeId.toString(),
        item.label,
        item.attributeCode,
        item.attributeDataType,
        item.validationRegx,
        item.placeholder,
        item.attributeType,
        item.unit,
        item.errorMessage,
        item.verificationType,
        item.remarks,
        item.attributeCode,
        item.evaluationFormula,
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

  // for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Attribute;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Attribute) => {
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
  const paginatedData = (
    searchTerm ? filteredData : [...(data || [])].reverse()
  ).slice((currentPage - 1) * rows, currentPage * rows);

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`${attributesAPI}/${id}`);
      // remove the deleted item from the data array
      setData((prevData) => prevData.filter((item) => item.attributeId !== id));
      notifyCreate(deleteMessage);
      console.log("item deleted successfully");
    } catch (err) {
      console.error("failed to delete item", err);
      setError((err as AxiosError).message);
      notifyError((err as AxiosError).message);
    }
  };

  const [projectDetailKeys, setProjectDetailKeys] = useState<string[]>([]);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiClient.get(`${getProjectDetailKeysAPI}`);
        const data = response.data.data; // Assuming this returns an array of group objects
        setProjectDetailKeys(data);
        console.log("projectDetailKeys", projectDetailKeys);
      } catch (error) {
        console.error("Error fetching selected groups:", error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <>
      {/* {error && <p className="text-danger">{error}</p>} */}
      {isLoading && <Loader />}
      <TableHeader
        heading="Attributes"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <Form
              api={attributesAPI}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
              projectDetailKeys={projectDetailKeys}
              data={data}
            />
          </div>
        }
      />
      <div className="table-responsive">
        <table
          className="table table-hover mb-5"
          style={{ border: ".5px solid #858585" }}
        >
          <thead>
            <tr
              className={`color-dark-blue cursor-pointer ${inter.className}`}
              style={{
                border: ".41px solid rgba(81,81,81,0.20) !important",
                fontSize: ".85rem",
              }}
            >
              <TableHeading
                name="attribute Id"
                handleSort={() => handleSort("attributeId")}
              />
              <TableHeading
                name="sort Id"
                handleSort={() => handleSort("sortId")}
              />
              <TableHeading
                name="attribute data type"
                handleSort={() => handleSort("attributeDataType")}
              />
              <TableHeading
                name="multiselect"
                handleSort={() => handleSort("multiselect")}
              />
              <TableHeading
                name="label"
                handleSort={() => handleSort("label")}
              />
              <TableHeading
                name="validation regx"
                handleSort={() => handleSort("validationRegx")}
              />
              <TableHeading
                name="attribute code"
                handleSort={() => handleSort("attributeCode")}
              />
              <TableHeading name="min" handleSort={() => handleSort("min")} />
              <TableHeading name="max" handleSort={() => handleSort("max")} />
              <TableHeading
                name="required"
                handleSort={() => handleSort("required")}
              />
              <TableHeading
                name="status"
                handleSort={() => handleSort("status")}
              />
              <TableHeading
                name="hidden"
                handleSort={() => handleSort("hidden")}
              />
              <TableHeading
                name="placeholder"
                handleSort={() => handleSort("placeholder")}
              />
              <TableHeading
                name="attribute type"
                handleSort={() => handleSort("attributeType")}
              />
              <TableHeading name="unit" handleSort={() => handleSort("unit")} />
              <TableHeading
                name="error message"
                handleSort={() => handleSort("errorMessage")}
              />
              <TableHeading
                name="verification type"
                handleSort={() => handleSort("verificationType")}
              />
              <TableHeading
                name="evaluation formula"
                handleSort={() => handleSort("evaluationFormula")}
              />
              <TableHeading
                name="weightage"
                handleSort={() => handleSort("weightage")}
              />
              <TableHeading
                name="remarks"
                handleSort={() => handleSort("remarks")}
              />
              <TableHeading
                name="removeable"
                handleSort={() => handleSort("removeable")}
              />
              <TableHeading
                name="options"
                handleSort={() => handleSort("options")}
              />
              <TableHeading
                name="Master"
                handleSort={() => handleSort("isMaster")}
              />
              <TableHeading
                name="priority"
                handleSort={() => handleSort("priority")}
              />

              <th colSpan={2}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((d, i) => (
              <tr
                className={dmSans.className}
                style={{
                  border: ".41px solid rgba(81,81,81,0.20) !important",
                  fontSize: ".85rem",
                }}
                key={i}
              >
                <td>{d.attributeId}</td>
                <td>{d.sortId}</td>
                <td>{d.attributeDataType}</td>
                <td>{d.multiselect}</td>
                <td>{d.label}</td>
                <td>{d.validationRegx}</td>
                <td>{d.attributeCode}</td>
                <td>{d.min}</td>
                <td>{d.max}</td>
                <td>{d.required}</td>
                <td>{d.status}</td>
                <td>{d.hidden}</td>
                <td>{d.placeholder}</td>
                <td>{d.attributeType}</td>
                <td>{d.unit}</td>
                <td>{d.errorMessage}</td>
                <td>{d.verificationType}</td>
                <td>{d.evaluationFormula}</td>
                <td>{d.weightage}</td>
                <td>{d.remarks}</td>
                <td>{d.removeable}</td>
                <td>
                  {d.options?.map((option: any, i) => (
                    <span key={i}>
                      {option.label}
                      ,&nbsp;
                    </span>
                  ))}
                </td>
                <td>
                  {d.isMaster === 0 || d.isMaster === null ? "No" : "Yes"}
                </td>
                <td>{d.priority}</td>
                <td>
                  <DeleteModal handleDelete={handleDelete} id={d.attributeId} />
                </td>
                <td>
                  <Form
                    api={attributesAPI}
                    method="PUT"
                    id={d.attributeId}
                    setRefresh={setRefresh}
                    refresh={refresh}
                    projectDetailKeys={projectDetailKeys}
                    data={data}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={26}>
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
