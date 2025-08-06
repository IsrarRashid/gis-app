"use client";

import Button from "@/app/components/Button";
import { Plus_Jakarta_Sans } from "next/font/google";
import { FaCheck, FaRegTrashAlt } from "react-icons/fa";
import { IoArrowForwardCircleOutline, IoClose } from "react-icons/io5";
import { FiPlus, FiSearch } from "react-icons/fi";
import Select, { StylesConfig } from "react-select";
import { useRouter } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Attribute } from "@/app/hooks/useAttributes";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { REPORT_API } from "@/app/APIs";
import { toast } from "react-toastify";
import { createdMessage } from "@/app/utils";
import Spinner from "@/app/components/Spinner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
type OptionType = { value: string; label: string };

const schema = z.object({
  reportName: z.string().min(1, { message: "Please add Report Name!" }),
  attributeIds: z
    .array(z.number({ invalid_type_error: "Please add Attribute!" }))
    .min(1, "At least one attribute is required"),
  groupByFields: z.array(z.string()),
  attributeFunctions: z.record(z.string()), // Accepts dynamic keys with string values
  orderByFields: z
    .array(z.string().min(1, { message: "Please add OrderBy!" }))
    .min(1, { message: "Please select an Option!" }),
});

type MasterReportGenerate = z.infer<typeof schema>;

interface Props {
  handleClose: () => void;
  attributes: Attribute[];
  show: boolean;
  setRefreshTabs: Dispatch<SetStateAction<boolean>>;
}

const Form = ({ handleClose, attributes, show, setRefreshTabs }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<MasterReportGenerate>({
    resolver: zodResolver(schema),
    defaultValues: {
      attributeFunctions: {}, // 👈 This is the key-value map you want to populate
    },
  });
  const [isSubmitting, setSubmitting] = useState(false);

  const router = useRouter();

  const customStyles: StylesConfig<OptionType, false> = {
    control: (base) => ({
      ...base,
      fontSize: "14px",
      boxShadow: "none",
      border: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: 4,
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: 4,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 6px",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
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
      backgroundColor: state.isFocused ? "#f0f0f0" : "white",
      color: "#333",
      fontSize: "14px",
    }),
  };

  const customStyles2: StylesConfig<OptionType, false> = {
    control: (base) => ({
      ...base,
      fontSize: "14px",
      border: "1px solid #EDF1F3",
      boxShadow: "0px 3px 5px rgba(228, 229, 231, 0.24)",
      borderRadius: "10px",
      height: "41.19px",
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
      backgroundColor: state.isFocused ? "#f0f0f0" : "white",
      color: "#333",
      fontSize: "14px",
    }),
  };

  const functionStatuses = [
    { value: "NONE", label: "NONE" },
    { value: "SUM", label: "SUM" },
    { value: "AVG", label: "AVG" },
    { value: "MIN", label: "MIN" },
    { value: "MAX", label: "MAX" },
  ];

  const defaultGroupByFields = [
    "ProjectId",
    "Project.GsNo",
    "Project.Name",
    "Project.Sector.Name",
    "Project.Division.Name",
    "Project.District.Name",
    "Project.SponsoringAgency.Name",
    "Project.ExecutionAgency.Name",
  ];

  const orderByOptions = defaultGroupByFields.map((defaultGroupByField) => {
    return {
      value: defaultGroupByField,
      label: defaultGroupByField.replaceAll(".", " "),
    };
  });

  const [groupByFields, setGroupByFields] = useState<string[]>([]);

  useEffect(() => {
    if (show) {
      setGroupByFields(defaultGroupByFields);
      setValue("groupByFields", defaultGroupByFields);
    }
  }, [show]);

  const [availableAttributes, setAvailableAttributes] = useState(
    attributes.filter((a) => a.isMaster === 1)
  );

  const handleAddAttribute = (attributeId: number) => {
    const current = getValues("attributeIds") || [];

    // update form value
    setValue("attributeIds", [...current, attributeId]);

    // remove from display list
    setAvailableAttributes((prev) =>
      prev.filter((attr) => attr.attributeId !== attributeId)
    );
  };

  const handleDeleteAttribute = (id: number) => {
    const current = getValues("attributeIds") || [];
    const updated = current.filter((attrId) => attrId !== id);
    setValue("attributeIds", updated);

    // Restore back to available attributes
    const restoredAttr = attributes.find((a) => a.attributeId === id);
    if (restoredAttr) {
      setAvailableAttributes((prev) => [...prev, restoredAttr]);
    }
  };

  const attributeIds =
    useWatch({
      name: "attributeIds",
      control,
    }) || [];

  const toggleGroupByField = (field: string) => {
    const current: string[] = getValues("groupByFields") || [];
    const isPresent = current.includes(field);
    const updated = isPresent
      ? current.filter((item) => item !== field)
      : [...current, field];

    setValue("groupByFields", updated);
    setGroupByFields(updated);
    console.log("groupByFields", getValues("groupByFields"));
  };

  const onSubmit = async (formData: MasterReportGenerate) => {
    console.log("Form Data:", formData);
    console.log(errors);

    try {
      setSubmitting(true);
      const response = await apiClient.post(REPORT_API + "/generate", formData);
      console.log("Response:", response);
      toast.success(createdMessage);
      handleClose();
      setRefreshTabs((prev) => !prev);
      router.push("/report-analysis/list");
    } catch (err) {
      setSubmitting(false);
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    } finally {
      setSubmitting(false); // Always run after try/catch
    }
  };

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredAttributes, setFilteredAttributes] = useState<Attribute[]>([]);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = availableAttributes.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAttributes(filtered);
    }
  }, [searchTerm, availableAttributes]);

  return (
    <div
      className={`col p-3 bg-white ${plusJakartaSans.className}`}
      style={{
        borderRadius: "15px",
        border: "1px solid #E2E4E5",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row d-flex justify-content-between">
          <div className="col-auto">
            <p
              className="fw-6 d-none d-md-block"
              style={{ fontSize: "2.25rem" }}
            >
              Master Report Form
            </p>
            <p
              className="fw-6 d-block d-md-none"
              style={{ fontSize: "1.25rem" }}
            >
              Master Report Form
            </p>
          </div>
          <div className="col-auto">
            <div className="row">
              <div className="col-auto text-end">
                <Button
                  type="submit"
                  className="btn bg-color-sea-blue text-white"
                  style={{ borderRadius: "8px" }}
                  disabled={isSubmitting}
                >
                  Generate <IoArrowForwardCircleOutline size={24} />{" "}
                  {isSubmitting && <Spinner color="text-light" />}
                </Button>
              </div>
              <div className="col-auto">
                <Button type="button" className="btn" onClick={handleClose}>
                  <AiOutlineClose />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 mb-3">
            <label
              htmlFor="reportName"
              className="form-label fw-5 fs12px"
              style={{ color: "#6C7278" }}
            >
              Report Name
            </label>
            <input
              {...register("reportName")}
              id="reportName"
              type="text"
              className="form-control form-control-sm color-light-dark"
              style={{
                border: "1px solid #EDF1F3",
                boxShadow: "0px 3px 5px rgba(228, 229, 231, 0.24)",
                borderRadius: "10px",
              }}
              placeholder="Enter Report Name"
            />
            {errors.reportName && (
              <p className="text-danger mt-1 fs14px">
                {errors.reportName.message}
              </p>
            )}
          </div>
          <div className="col-12 col-sm-6 col-md-5 col-lg-4 col-xl-3 mb-3">
            <label
              htmlFor="orderBy"
              className="form-label fw-5 fs12px"
              style={{ color: "#6C7278" }}
            >
              Order By
            </label>
            <Controller
              name="orderByFields"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={orderByOptions} // must be in format { value, label }
                  placeholder="Select"
                  styles={customStyles2}
                  menuPortalTarget={document.body}
                  isClearable
                  // Convert between react-select and raw value
                  value={
                    orderByOptions.find(
                      (opt) => opt.value === field.value?.[0]
                    ) || null
                  }
                  onChange={(selectedOption) => {
                    field.onChange(
                      selectedOption ? [selectedOption.value] : []
                    );
                  }}
                />
              )}
            />
            {errors.orderByFields && (
              <p className="text-danger mt-1 fs14px">
                {errors.orderByFields.message}
              </p>
            )}
          </div>
        </div>
        <div className="row">
          {defaultGroupByFields.map((groupByField, i) => (
            <div key={i} className="col-auto mb-2 pe-0">
              <Button
                type="button"
                className={`btn rounded-pill fw-5 fs14px ${
                  groupByFields.includes(groupByField)
                    ? "bg-color-sea-blue text-white"
                    : "bg-white"
                }`}
                style={{
                  border: "1px solid #EDF1F3",
                  padding: "14px",
                  boxShadow: "0px 3px 5px rgba(228, 229, 231, 0.24)",
                }}
                onClick={() => toggleGroupByField(groupByField)}
              >
                <span className="pe-3">{groupByField}</span>{" "}
                {groupByFields.includes(groupByField) ? (
                  <FaCheck />
                ) : (
                  <IoClose size={16} />
                )}
              </Button>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-12 col-sm-12 col-md-7 col-lg-8">
            <div className="table-responsive rounded-3">
              <table
                className="table table-bordered mb-3 rounded-3 overflow-hidden"
                style={{ borderColor: "#F2F2F2" }}
              >
                <thead>
                  <tr className={`cursor-pointer fs14px`}>
                    <th className="bg-color-sea-blue text-white fw-bold border-0">
                      Attributes
                    </th>
                    <th className="bg-color-sea-blue text-white fw-bold border-0">
                      Function
                    </th>
                    <th className="bg-color-sea-blue text-white fw-bold text-center border-0">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attributeIds?.map((id, i) => {
                    const attribute = attributes.find(
                      (attr) => attr.attributeId === id
                    );
                    if (!attribute) return null;

                    return (
                      <tr key={i} className={`fs12px`}>
                        <td
                          className="fw-5"
                          style={{ color: "#404040", verticalAlign: "middle" }}
                        >
                          {attribute.label}
                        </td>
                        <td className="fw-5" style={{ color: "#404040" }}>
                          <Select
                            options={functionStatuses}
                            defaultValue={functionStatuses[0]}
                            placeholder="Select function"
                            classNamePrefix="react-select"
                            styles={customStyles}
                            menuPortalTarget={document.body}
                            onChange={(selectedOption) => {
                              setValue(
                                `attributeFunctions.${id}`,
                                selectedOption?.value ?? "NONE"
                              );
                            }}
                          />
                        </td>
                        <td
                          className="fw-5 text-center"
                          style={{ color: "#404040", verticalAlign: "middle" }}
                        >
                          <Button
                            type="button"
                            className="btn"
                            onClick={() => handleDeleteAttribute(id)}
                          >
                            <FaRegTrashAlt
                              style={{ color: "#E22F2F" }}
                              size={20}
                            />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-5 col-lg-4 ps-0">
            <div className="table-responsive rounded-3">
              <table
                className="table table-bordered mb-3 rounded-3 overflow-hidden"
                style={{ borderColor: "#F2F2F2" }}
              >
                <thead>
                  <tr className={`cursor-pointer fs14px`}>
                    <th className="bg-color-sea-blue text-white fw-bold text-center border-0">
                      Attributes
                    </th>
                    <th className="bg-color-sea-blue text-white fw-bold text-center border-0">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={`fs12px`}>
                    <td
                      colSpan={2}
                      className="fw-5 text-center"
                      style={{ color: "#404040", verticalAlign: "middle" }}
                    >
                      <div className="col position-relative">
                        <input
                          type="text"
                          id="inputPassword6"
                          className="form-control pe-5 "
                          aria-describedby="passwordHelpInline"
                          placeholder="Search"
                          style={{
                            border: "1px solid #EDF1F3",
                            boxShadow: "0px 3px 5px rgba(228, 229, 231, 0.24)",
                            borderRadius: "10px",
                          }}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          value={searchTerm}
                        />
                        <div
                          className="col position-absolute"
                          style={{ top: 11, right: 15 }}
                        >
                          <FiSearch size={20} style={{ color: "#656565" }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                  {(searchTerm.trim().length > 0
                    ? filteredAttributes
                    : availableAttributes
                  )?.map((attribute, i) => (
                    <tr key={i} className={`fs12px`}>
                      <td
                        className="fw-5 text-center"
                        style={{ color: "#404040", verticalAlign: "middle" }}
                      >
                        {attribute.label}
                      </td>
                      <td
                        className="fw-5 text-center"
                        style={{ color: "#404040" }}
                      >
                        <Button
                          type="button"
                          className="btn"
                          onClick={() =>
                            handleAddAttribute(attribute.attributeId)
                          }
                        >
                          <FiPlus size={20} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
