"use client";
import { TEMP_TOUR_PLAN_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import Loader from "@/app/components/Loader";
import Spinner from "@/app/components/Spinner";
import useAuthentication from "@/app/hooks/useAuthentication";
import useDistrict from "@/app/hooks/useDistrict";
import useDriver from "@/app/hooks/useDriver";
import useTempTourPlans, { TempTourPlan } from "@/app/hooks/useTempTourPlan";
import useTourPlans from "@/app/hooks/useTourPlans";
import useVehicle from "@/app/hooks/useVehicle";
import apiClient from "@/app/services/api-client";
import {
  addDayToFormattedDate,
  deleteMessage,
  getFormattedDate,
  Option,
} from "@/app/utils";
import { AxiosError } from "axios";
import { sort } from "fast-sort";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { toast } from "react-toastify";
import Form, { COUTempTourPlan, TempCopyForm, typeStatues } from "./Form";
import DownloadDropDown from "@/app/components/UserDropDown/DownloadDropDown";
import * as XLSX from "xlsx";
import { IoMdInformationCircle } from "react-icons/io";
const inter = Inter({ subsets: ["latin"] });

interface CreateVisit {
  id: number;
  projectId: number;
  department_Id: number;
  assignedTo: number;
  status: number;
  latitude: string | null;
  longitude: string | null;
  vehicleID: number;
  districtID: number;
  mriValue: number | null;
  driverID: number;
  fromDate: string;
  toDate: string;
  createdAt: string;
  updatedAt: string;
  complete_at: string | null;
  submitted_at: string | null;
  issued_at: string | null;
  tracking_status: boolean;
  is_Contractor: number | null;
  is_ResidentEngineer: number | null;
  is_Tpv: number | null;
  visitPlanGroup: number;
  one_pager_status: string | null;
  cancel_reason: string | null;
  op_submitted_at: string | null;
  submitted_from: number | null;
  submitted_to: number | null;
}

const List = () => {
  const [refresh, setRefresh] = useState(false);
  const [visitPlanGroup, setVisitPlanGroup] = useState<number>(-1);
  const { data, setData, isLoading } = useTempTourPlans({ refresh });
  const { data: users } = useAuthentication();
  const { data: drivers } = useDriver();
  const { data: vehicles } = useVehicle();
  const { data: districts } = useDistrict();
  const { data: tours } = useTourPlans();
  const [copiedRowIndex, setCopiedRowIndex] = useState<number>(-1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [isSubmitting, setSubmitting] = useState(false);
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // const [tempJsonData, setTempJsonData] = useState<CreateVisit[]>();
  const [tempJsonData, setTempJsonData] = useState<COUTempTourPlan[]>();

  // State for filtered data
  const [filteredData, setFilteredData] = useState<TempTourPlan[]>([]);

  const [formsData, setFormsData] = useState<COUTempTourPlan[]>([]);
  const [copiedFormData, setCopiedFormData] = useState<
    TempCopyForm | undefined
  >();

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      [
        item.gsNo.toString(),
        item.projectId.toString(),
        item.projectid.toString(),
        item.projectName,
        item.district,
        item.sectors,
        item.cost.toString(),
        item.type.toString(),
        item.userId.toString(),
        item.meOfficerName,
        item.section,
        item.driverName,
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
    key: keyof TempTourPlan;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof TempTourPlan) => {
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

  const saveFormsData = async (formsData: COUTempTourPlan[]) => {
    console.log("formsData", formsData);
    const filteredFormsData = formsData.filter((form) => form !== undefined);
    console.log("filteredFormsData", filteredFormsData);
    setTempJsonData(filteredFormsData);
    try {
      const response = await apiClient.post(
        `${TEMP_TOUR_PLAN_API}/create-or-update`,
        filteredFormsData
      );
      console.log(response);
      toast.success(response.data.message);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.log(err);
      toast.error((err as AxiosError).message);
    }
  };

  const createVisit = async (formsData: COUTempTourPlan[]) => {
    if (!visitPlanGroup || visitPlanGroup === -1) {
      toast.error("Please select visit plan");
      return;
    }
    console.log("formsData", formsData);
    const filteredFormsData = formsData.filter((form) => form !== undefined);
    console.log("filteredFormsData", filteredFormsData);

    const modifiedFormData: CreateVisit[] = filteredFormsData.map((form) => ({
      id: 0,
      projectId: form.projectid,
      department_Id: form.department_id ?? 0,
      assignedTo: form.userId,
      status: 0, // or whatever logic you need
      latitude: "", // default or calculate if needed
      longitude: "", // default or calculate if needed
      vehicleID: form.vehicalId,
      districtID: form.district_Id,
      mriValue: 0, // provide default or calculate
      driverID: form.driverId,
      fromDate: form.dateFrom,
      toDate: form.dateTo,
      createdAt: new Date().toISOString(), // or another appropriate value
      updatedAt: new Date().toISOString(), // or another appropriate value
      complete_at: null,
      submitted_at: null,
      issued_at: null,
      tracking_status: false,
      is_Contractor: null,
      is_ResidentEngineer: null,
      is_Tpv: null,
      visitPlanGroup,
      one_pager_status: null,
      cancel_reason: null,
      op_submitted_at: null,
      submitted_from: null,
      submitted_to: null,
    }));

    console.log(modifiedFormData);
    // setTempJsonData(modifiedFormData);
    try {
      setSubmitting(true);
      const response = await apiClient.post(
        `${TEMP_TOUR_PLAN_API}/create-visit`,
        modifiedFormData
      );
      console.log(response);
      toast.success(response.data.responseMessage);
    } catch (err) {
      setSubmitting(false);
      console.log(err);
      toast.error((err as AxiosError).message);
    } finally {
      setSubmitting(false); // Always run after try/catch
    }
  };

  const customStyles: StylesConfig<Option, false> = {
    control: (base) => ({
      ...base,
      fontSize: "14px",
      backgroundColor: "rgba(16, 143, 168, .1)",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      // backgroundColor: state.isFocused ? "#f0f0f0" : "white",
      // color: "#333",
      fontSize: "14px",
    }),
  };

  const defaultNumberOption = { value: "-1", label: "Select" };

  const tourNames = tours.map((tour) => {
    return {
      value: String(tour.id),
      label: tour.name,
    };
  });

  const exportToExcel = (data: TempTourPlan[]) => {
    // Prepare data for export
    console.log("data", data);

    // Map the modifiedFormData to the desired Excel column structure
    const dataForExcel = data.map((item, index) => {
      return {
        "Sr. No.": index + 1,
        "GS No.": item.gsNo,
        "Name of Scheme": item.projectName,
        District: item.district,
        Sectors: item.sectors,
        Cost: item.cost,
        "Scheme Type": typeStatues.find((type) => type.value === item.type)
          ?.label,
        "Evaluator Name": item.meOfficerName,
        Section: item.section,
        "Date From": addDayToFormattedDate(getFormattedDate(item.dateFrom)),
        "Date To": addDayToFormattedDate(getFormattedDate(item.dateTo)),
        "Driver Name": item.driverName,
        "Vehicle Number": item.vehicleNumber,
      };
    });

    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visit Plans"); // Changed sheet name

    // Write the workbook to a file
    XLSX.writeFile(
      workbook,
      `Generated Visit Plans ${new Date().toLocaleDateString()}.xlsx`
    ); // Changed filename
  };

  const handleDelete = async (tempId: number) => {
    try {
      await apiClient.delete(`${TEMP_TOUR_PLAN_API}/${tempId}`);
      // remove the deleted item from the data array
      setRefresh((prev) => !prev);
      setFormsData((prevData) =>
        prevData.filter((item) => item !== undefined && item.id !== tempId)
      );
      toast.success(deleteMessage);
      console.log("item deleted successfully");
    } catch (err) {
      console.error("failed to delete item", err);
      toast.error((err as AxiosError).message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {/* <TableHeader
        heading="M&E Visit Plan for the month of May-2025"
        searchTerm={searchTerm}
        filteredData={filteredData}
        data={data}
        handleChange={handleChange}
        form={
          <div className="col-auto">
            <Form
              api={DEPARTMENT_API + "/CreateDepartmentWithRights"}
              method="POST"
              setRefresh={setRefresh}
              refresh={refresh}
            />
          </div>
        }
      /> */}
      <div className="row m-0">
        <div className="col"></div>
        <div className="col">
          <h4 className="fw-bold mb-3 text-center">M&E Visit Plan</h4>
          {/* <pre>{tempJsonData ? JSON.stringify(tempJsonData, null, 2) : ""}</pre> */}
        </div>
        <div className="col text-end">
          {formsData.filter((form) => form !== undefined).length > 0 && (
            <Button
              className="btn btn-sm bg-color-sea-blue text-white"
              disabled={isSubmitting}
              onClick={() => createVisit(formsData)}
            >
              Create Visit {isSubmitting && <Spinner color="text-light" />}
            </Button>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-sm-10 col-md-6 col-lg-8 col-xl-5 mb-3">
          <label htmlFor="tours" className="form-label">
            Visit Plan
          </label>
          {isClient && (
            <Select
              options={[defaultNumberOption, ...tourNames]}
              name="tours"
              id="tours"
              isClearable
              isSearchable
              menuPlacement="auto"
              menuPosition="absolute"
              menuPortalTarget={document.body}
              styles={customStyles}
              onChange={(
                newValue: SingleValue<{ value: string; label: string }>
              ) => {
                if (newValue) {
                  setVisitPlanGroup(Number(newValue.value));
                }
              }}
            />
          )}
          {!visitPlanGroup ||
            (visitPlanGroup === -1 && (
              <p className="text-danger mt-1">Please Add Visit Plan!</p>
            ))}
        </div>
        {data && data.length > 0 && (
          <div className="col text-end align-self-end mb-3">
            <DownloadDropDown onClickExcel={() => exportToExcel(data)} />
          </div>
        )}
      </div>
      {/* <div className="col-4">
        <select
          className="form-select form-select-sm color-light-dark"
          id="visitPlans"
        >
          <option value="">Select</option>
        </select>
        
      </div> */}

      <div className="table-responsive rounded-3 shadow-sm mb-3">
        <table
          className="table table-bordered mb-3 rounded-3 overflow-hidden table-hover"
          style={{ borderColor: "#B9B9B9" }}
        >
          <thead>
            <tr
              className={`color-dark-blue cursor-pointer fs12px ${inter.className}`}
            >
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                Sr. No.
              </th>
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                Project ID
              </th>
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                GS No
              </th>
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                Name of Scheme
              </th>
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                District
              </th>
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                Sectors
              </th>
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                Cost
              </th>
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                Type
              </th>
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                M&E Officer Name
              </th>
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                Section
              </th>
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                Date From
              </th>
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                Date To
              </th>
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                Driver Name
              </th>
              <th className="bg-color-sea-green text-white fw-6 text-center text-nowrap">
                Vehicle Number
              </th>
              <th
                colSpan={4}
                className="bg-color-sea-green text-white fw-6 text-center text-nowrap"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((d, i) => (
              <Form
                copiedRowIndex={copiedRowIndex}
                setCopiedRowIndex={setCopiedRowIndex}
                key={d.tempId}
                planData={d}
                index={i + 1}
                users={users}
                drivers={drivers}
                vehicles={vehicles}
                districts={districts}
                setFormsData={setFormsData}
                handleDelete={() => handleDelete(d.tempId)}
                setCopiedFormData={setCopiedFormData}
                copiedFormData={copiedFormData}
              />
            ))}
          </tbody>
        </table>
      </div>
      {formsData.filter((form) => form !== undefined).length > 0 ? (
        <div className="col text-end">
          <Button
            onClick={() => saveFormsData(formsData)}
            className="btn bg-color-sea-blue text-white fs12px fw-6 me-2"
          >
            Approval
          </Button>
          <Button
            onClick={() => saveFormsData(formsData)}
            className="btn bg-color-sea-blue text-white fs12px fw-6"
          >
            Save Changes
          </Button>
        </div>
      ) : (
        <div className="alert alert-info" role="alert">
          <IoMdInformationCircle /> Please go to Projects page to add Visit
          Plans!
        </div>
      )}
    </>
  );
};

export default List;
