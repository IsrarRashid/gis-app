"use client";
import { DEPARTMENT_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import apiClient, {
  AxiosError,
  ErrorResponse,
} from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import { z } from "zod";
import more from "../../../public/icons/more.svg";
import { RxCross2 } from "react-icons/rx";

const departmentSchema = z.object({
  id: z.number().optional().default(0),
  name: z.string().min(1, { message: "Please add Department Name!" }),
  shortName: z.string().min(1, { message: "Please add Short Name!" }),
  logo: z.string().optional().default("-"),
  address: z.string().min(1, { message: "Please add Address!" }),
  email: z.string().email(),
  phoneNumber: z.string().min(1, { message: "Please add Phone number!" }),
});

const departmentRightSchema = z.object({
  id: z.number().optional().default(0),
  department_Id: z.number().optional().default(0),
  fieldName: z.string().min(1, { message: "Please add Field Name!" }),
  fieldValue: z.string().min(1, { message: "Please add Field Value!" }),
});

export const schema = z.object({
  department: departmentSchema,
  departmentRights: z
    .array(departmentRightSchema)
    .default([])
    // .refine((val) => val.length >= 1, {
    //   message: "Please add at least one department right.",
    // })
    .optional(),
});

export type DepartmentWithRights = z.infer<typeof schema>;

interface FiledList {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
}

interface DataAgainstFiled {
  id: number;
  // for parameter 1
  divisionName: string;
  districtName: string;
  latitude: string;
  longitude: string;
  // for parameter 2 and 3
  name: string; // for parameter 4 and 5
  description: string;
  // for parameter 3
  parentId: number;
  createdAt: string; // for parameter 4
  updateAt: string;
  sortId: number;
  // for parameter 4 and 5
  status: boolean;
  updatedAt: string;
}

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}

interface Option {
  value: string;
  label: string;
}

const Form = ({ api, method, id, setRefresh }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<DepartmentWithRights>({
    resolver: zodResolver(schema),
    defaultValues: {
      department: {
        id: 0,
        name: "",
        logo: "-",
        address: "",
        email: "",
        phoneNumber: "",
      },
      departmentRights: [],
    },
  });
  //   const [filedList, setFiledList] = useState<Record<string, string>>({});

  const [filedList, setFiledList] = useState<FiledList>({
    "1": "",
    "2": "",
    "3": "",
    "4": "",
    "5": "",
  });
  //   const [dataAgainstFiled, setDataAgainstFiled] = useState<DataAgainstFiled[]>(
  //     []
  //   );
  const [fieldValueOptionsMap, setFieldValueOptionsMap] = useState<{
    [index: number]: Option[];
  }>({});

  useEffect(() => {
    const getFiledList = async () => {
      try {
        const response = await apiClient.get(`${DEPARTMENT_API}/GetFieldList`);
        console.log(response);
        setFiledList(response.data.data);
      } catch (err) {
        console.error("Submission error:", err);
        toast.error(
          (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
            (err as AxiosError<ErrorResponse>).message
        );
      }
    };
    getFiledList();
  }, []);

  const getDataAgainstFiled = async (id: number, index: number) => {
    try {
      const response = await apiClient.get(
        `${DEPARTMENT_API}/GetDataAgainstField?id=${id}`
      );
      console.log(response);
      //   setDataAgainstFiled(response.data.data);
      const data = response.data.data;
      const options = Array.isArray(data)
        ? data.map((item: any) => ({
            value: item.id.toString(),
            label:
              item.districtName ||
              item.name ||
              item.divisionName ||
              `Item ${item.id}`,
          }))
        : [];

      setFieldValueOptionsMap((prev) => ({
        ...prev,
        [index]: options,
      }));
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(
        (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
          (err as AxiosError<ErrorResponse>).message
      );
    }
  };

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "departmentRights",
  });

  const [show, setShow] = useState(false);

  const createdMessage = "Created Successfully";
  const updatedMessage = "Updated Successfully";

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const addNewRole = () => {
    append({ id: 0, department_Id: 0, fieldName: "", fieldValue: "" });
  };

  const handleShow = async () => {
    setShow(true);
    if (method === "PUT") {
      try {
        const response = await apiClient.get(`${api}/${id}`);
        console.log("get response", response.data);
        const itemData: DepartmentWithRights = response.data.data;
        setValue("department.id", itemData.department.id);
        setValue("department.name", itemData.department.name);
        setValue("department.shortName", itemData.department.shortName);
        setValue("department.logo", itemData.department.logo);
        setValue("department.address", itemData.department.address);
        setValue("department.email", itemData.department.email);
        setValue("department.phoneNumber", itemData.department.phoneNumber);

        // Reverse map: string fieldName → numeric key
        const reverseFiledList: Record<string, string> = {};
        Object.entries(filedList).forEach(([key, value]) => {
          reverseFiledList[value] = key;
        });

        if (itemData.departmentRights && itemData.departmentRights.length > 0) {
          // Replace with numeric key instead of string label
          const updatedRights = itemData.departmentRights.map((item) => ({
            ...item,
            fieldName: reverseFiledList[item.fieldName] || "", // convert to number key
          }));

          replace(updatedRights);

          // Fetch options for each field
          updatedRights.forEach((item, index) => {
            const fieldNameId = Number(item.fieldName); // Make sure it's numeric
            if (fieldNameId) {
              getDataAgainstFiled(fieldNameId, index);
            }
          });
        }
      } catch (err) {
        console.log((err as AxiosError).message);
        toast.error((err as AxiosError).message);
      }
    }
  };

  // Options for your dropdown
  //   const fieldValueOptions = [
  //     { value: "true", label: "True" },
  //     { value: "false", label: "False" },
  //     { value: "read", label: "Read" },
  //     { value: "write", label: "Write" },
  //     // Add more as needed
  //   ];

  //   const [rightsData, setRightsData] = useState<DepartmentRight[]>([
  //     {
  //       id: 0,
  //       department_Id: 0,
  //       fieldName: "",
  //       fieldValue: "",
  //     },
  //   ]);

  //   const handleDeleteRight = (index: number) => {
  //     setRightsData((prevData) => prevData.filter((_, i) => i !== index));
  //   };

  // Function to handle adding new option
  //   const addNewRole = () => {
  //     setRightsData((prevOptions) => [
  //       ...prevOptions,
  //       {
  //         id: 0,
  //         department_Id: 0,
  //         fieldName: "",
  //         fieldValue: "",
  //       },
  //     ]);
  //   };

  const onSubmit = async (formData: DepartmentWithRights) => {
    console.log("Form Data:", formData);
    console.log(errors);

    const modifiedFormData = {
      ...formData, // your form data
      departmentRights: formData.departmentRights?.map((right) => ({
        ...right,
        fieldName:
          filedList[right.fieldName as keyof FiledList] || right.fieldName,
      })),
    };

    console.log("modified Form Data:", modifiedFormData);

    try {
      const response = await apiClient({
        method: method,
        url: method === "POST" ? api : `${api}/Update`,
        data: modifiedFormData,
      });
      console.log("Response:", response);
      setRefresh((prev) => !prev);
      // setData((prevData) => [...prevData, response.data.data]);
      toast.success(method === "POST" ? createdMessage : updatedMessage);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
  };

  //   const handleRightChange = (
  //     index: number,
  //     e: React.ChangeEvent<HTMLInputElement>
  //   ) => {
  //     const { name, value } = e.target;
  //     setRightsData((prevOptions) =>
  //       prevOptions.map((option, i) =>
  //         i === index ? { ...option, [name]: value } : option
  //       )
  //     );
  //   };

  return (
    <>
      <Button
        type="button"
        className={`btn shadow ${
          method === "POST"
            ? "text-white bg-color-sea-green"
            : "rounded-pill ps-3 pe-3 pt-1 pb-1"
        }`}
        onClick={handleShow}
        style={{
          background: method === "POST" ? "" : "rgba(255, 255, 255,.5)",
        }}
      >
        {method === "POST" ? (
          "+ Department"
        ) : (
          <Image src={more} alt="more" width={20} height={20} />
        )}
      </Button>

      <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="new-custom-modal"
        id={`formModal-${id}`}
      >
        <Modal.Header
          // className="bg-blur py-0 px-4"
          className="py-0 px-4"
          style={{ borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
          closeButton
        >
          <Modal.Title>
            <p className="text-center mt-4 fs18px fw-6">
              {method === "POST" ? "ADD NEW DEPARTMENT" : "UPDATE DEPARTMENT"}
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          <div
            // className="container-fluid pt-3 pb-3 ps-4 pe-4 bg-blur"
            className="container-fluid pt-3 pb-3 ps-4 pe-4"
            style={
              {
                // backgroundImage:
                //   "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6) ,rgba(255, 255, 255, 0.08))",
                // borderRadius: "12px",
                // border: "1.7px solid rgba(255, 255, 255, 0.6)",
              }
            }
          >
            <div className="row flex-column justify-content-center">
              <div className="col-lg-12"></div>
              <form className="px-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="row m-0">
                  <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label htmlFor="name" className="form-label fs14px fw-5">
                      Department Name
                    </label>
                    <input
                      {...register("department.name")}
                      id="name"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter Department Name"
                    />
                    {errors.department?.name && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.department.name.message}
                      </p>
                    )}
                  </div>
                  <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label
                      htmlFor="shortName"
                      className="form-label fs14px fw-5"
                    >
                      Short Name
                    </label>
                    <input
                      {...register("department.shortName")}
                      id="shortName"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="e.g. DGME"
                    />
                    {errors.department?.shortName && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.department.shortName.message}
                      </p>
                    )}
                  </div>
                  <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label
                      htmlFor="phoneNumber"
                      className="form-label fs14px fw-5"
                    >
                      Phone Number
                    </label>
                    <input
                      {...register("department.phoneNumber")}
                      id="phoneNumber"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter Phone Number"
                    />
                    {errors.department?.phoneNumber && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.department.phoneNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label htmlFor="address" className="form-label fs14px fw-5">
                      Addresss
                    </label>
                    <input
                      {...register("department.address")}
                      id="address"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Enter your Addresss"
                    />
                    {errors.department?.address && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.department.address.message}
                      </p>
                    )}
                  </div>
                  <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label htmlFor="email" className="form-label fs14px fw-5">
                      Email
                    </label>
                    <input
                      {...register("department.email")}
                      id="email"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="your@company.com"
                    />
                    {errors.department?.email && (
                      <p className="text-danger mt-1 fs14px">
                        {errors.department.email.message}
                      </p>
                    )}
                  </div>
                  <>
                    <div className="row d-flex justify-content-between align-items-center m-0 p-0">
                      <div className="col-auto">
                        <h5 className="fs18px fw-6 m-0">Add Rights</h5>
                      </div>
                      <div className="col-auto">
                        <Button
                          type="button"
                          onClick={addNewRole}
                          className="btn text-white w-100 border-0 rounded-pill fs13px"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, #0C8CE9 ,#1A67A0)",
                            paddingTop: "9px",
                            paddingBottom: "9px",
                          }}
                        >
                          Add More +
                        </Button>
                      </div>
                      {errors.departmentRights && (
                        <p className="text-danger mt-1 fs14px">
                          {errors.departmentRights.message}
                        </p>
                      )}
                    </div>
                    <hr />

                    {/* Rights Fields */}
                    {fields?.map((field, index) => (
                      <div className="row mb-2 m-0" key={field.id}>
                        <div className="col-md-6 ps-0">
                          <select
                            {...register(
                              `departmentRights.${index}.fieldName`,
                              {
                                onChange: (e) => {
                                  const selectedId = Number(e.target.value);
                                  if (!selectedId) {
                                    setFieldValueOptionsMap((prev) => ({
                                      ...prev,
                                      [index]: [],
                                    }));
                                    return;
                                  }

                                  // Fetch new options if a valid field is selected
                                  getDataAgainstFiled(selectedId, index);
                                },
                              }
                            )}
                            className="form-select form-select-sm"
                          >
                            <option value="">Select Field Name</option>
                            {Object.entries(filedList)?.map(([key, value]) => (
                              <option key={key} value={key}>
                                {value}
                              </option>
                            ))}
                          </select>
                          {errors.departmentRights?.[index]?.fieldName && (
                            <p className="text-danger mt-1 fs14px">
                              {
                                errors.departmentRights?.[index]?.fieldName
                                  .message
                              }
                            </p>
                          )}
                        </div>
                        <div className="col-md-6 pe-0">
                          <Controller
                            name={`departmentRights.${index}.fieldValue`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isMulti
                                closeMenuOnSelect={false}
                                options={fieldValueOptionsMap[index] || []}
                                classNamePrefix="react-select"
                                onChange={(selectedOptions) => {
                                  // Store as comma-separated string or JSON depending on backend
                                  field.onChange(
                                    selectedOptions
                                      .map((opt) => opt.value)
                                      .join(",")
                                  );
                                }}
                                value={(
                                  fieldValueOptionsMap[index] || []
                                ).filter((opt) =>
                                  field.value?.split(",")?.includes(opt.value)
                                )}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    padding: "2px",
                                  }),
                                }}
                              />
                            )}
                          />
                          {errors.departmentRights?.[index]?.fieldValue && (
                            <p className="text-danger mt-1 fs14px">
                              {
                                errors.departmentRights?.[index]?.fieldValue
                                  .message
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Centralized Remove Buttons */}
                    {fields.length > 0 && (
                      <div className="row mt-2 mb-4 m-0">
                        <div className="col ps-0">
                          {/* <h6 className="fs16px fw-6 mb-2">Remove Rights</h6> */}
                          {fields.map((field, index) => {
                            const id = 0;
                            // Get current fieldName value from form state
                            const selectedFieldNameId = watch(
                              `departmentRights.${index}.fieldName`
                            );
                            const selectedFieldNameLabel =
                              filedList?.[
                                selectedFieldNameId as keyof FiledList
                              ] || `Right #${index + 1}`;

                            return (
                              <Button
                                key={field.id}
                                className="me-2 mb-2 btn rounded-pill btn-outline-danger fs13px"
                                onClick={() => remove(index)}
                              >
                                {/* Remove Right #{index + 1} */}
                                {selectedFieldNameLabel} <RxCross2 />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                  {/* <div className="col mb-3">
                    <p className="mt-4 fs18px fw-6 ">Add Roles</p>
                    <div className="row">
                      <div className="col-6 text-start">
                        <select className="form-select form-select-sm color-light-dark">
                          <option value="">Select</option>
                          <option value="sponsoring_id">Sponsoring ID</option>
                        </select>
                      </div>
                      <div className="col-5 text-start ps-0">
                        <select className="form-select form-select-sm color-light-dark">
                          <option value="">Select</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                      <div className="col-auto text-end ps-0">
                        <Button
                          type="button"
                          className="btn rounded-circle border border-dark bg-white"
                        >
                          <FaPlus />
                        </Button>
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="col-12 col col-sm-12 col-md-12 col-lg-6 mb-3 text-start">
                    <label htmlFor="logo" className="form-label fs14px fw-5">
                      Logo
                    </label>
                    <input
                      {...register("logo")}
                      id="logo"
                      type="text"
                      className="form-control form-control-sm color-light-dark"
                      placeholder="Select your logo"
                    />
                    {errors.logo && (
                      <p className="text-danger mt-1 fs14px">{errors.logo.message}</p>
                    )}
                  </div> */}
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col col-12 col-sm-12 col-md-4 col-lg-3 mb-2">
                    <Button
                      className="btn btn-light w-100 border rounded-pill fs13px"
                      style={{ paddingTop: "9px", paddingBottom: "9px" }}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="col col-12 col-sm-12 col-md-4 col-lg-3">
                    <Button
                      className="btn text-white w-100 border-0 rounded-pill fs13px"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #0C8CE9 ,#1A67A0)",
                        paddingTop: "9px",
                        paddingBottom: "9px",
                      }}
                      type="submit"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Form;
