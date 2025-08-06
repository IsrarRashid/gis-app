import { TEMP_TOUR_PLAN_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import { Authentication } from "@/app/hooks/useAuthentication";
import { District } from "@/app/hooks/useDistrict";
import { Driver } from "@/app/hooks/useDriver";
import { TempTourPlan } from "@/app/hooks/useTempTourPlan";
import { Vehicle } from "@/app/hooks/useVehicle";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { deleteMessage, isValidDate, NumberOption } from "@/app/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DM_Sans } from "next/font/google";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import Select, { StylesConfig } from "react-select";
import DeleteModal from "@/app/components/DeleteModal";
import { FaPaste } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export interface TempCopyForm {
  district_Id: number;
  type: number;
  userId: number;
  dateFrom: string;
  dateTo: string;
  driverId: number;
  vehicalId: number;
}

const schema = z.object({
  id: z.number().optional().default(0),
  department_id: z.number().optional().default(0),
  projectid: z.number({ invalid_type_error: "Please add project Id!" }),
  district_Id: z.number({ invalid_type_error: "Please add district!" }),
  type: z.number({ invalid_type_error: "Please add type!" }),
  userId: z.number({ invalid_type_error: "Please add user!" }),
  section: z.string().nullable().optional(),
  dateFrom: z.string().optional().default(new Date().toISOString()),
  dateTo: z.string().optional().default(new Date().toISOString()),
  driverId: z.number({ invalid_type_error: "Please add driver!" }),
  vehicalId: z.number({ invalid_type_error: "Please add vehicle!" }),
});

export type COUTempTourPlan = z.infer<typeof schema>; //create or update temp tour plan

interface Props {
  planData: TempTourPlan;
  index: number;
  users: Authentication[];
  drivers: Driver[];
  vehicles: Vehicle[];
  setFormsData: Dispatch<SetStateAction<COUTempTourPlan[]>>;
  districts: District[];
  handleDelete: (id: number) => void;
  setCopiedFormData: Dispatch<SetStateAction<TempCopyForm | undefined>>;
  copiedFormData: TempCopyForm | undefined;
  setCopiedRowIndex: Dispatch<SetStateAction<number>>;
  copiedRowIndex: number;
}

export const typeStatues = [
  { value: 0, label: "Monitoring" },
  { value: 1, label: "Evaluation" },
  { value: 2, label: "MonitoringAndCMInitiative" },
];

const Form = ({
  planData,
  index,
  users,
  drivers,
  vehicles,
  districts,
  setFormsData,
  handleDelete,
  setCopiedFormData,
  copiedFormData,
  setCopiedRowIndex,
  copiedRowIndex,
}: Props) => {
  const {
    register,
    trigger,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<COUTempTourPlan>({ resolver: zodResolver(schema) });
  console.log(errors);
  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  const [isDriverVerified, setDriverVerified] = useState(false);
  const [isVehicleVerified, setVehicleVerified] = useState(false);

  // const subscription = watch((value) => {
  //   setFormsData((prev) => {
  //     const updated = [...prev];
  //     updated[index] = {
  //       id: value.id ?? 0,
  //       department_id: value.department_id ?? 0,
  //       projectId: value.projectId ?? 0,
  //       type: value.type ?? "",
  //       userId: value.userId ?? 0,
  //       section: value.section ?? 0,
  //       dateFrom: value.dateFrom ?? "",
  //       dateTo: value.dateTo ?? "",
  //       driverId: value.driverId ?? 0,
  //       vehicalId: value.vehicalId ?? 0,
  //     };
  //     return updated;
  //   });
  // });

  useEffect(() => {
    const subscription = watch((value) => {
      setFormsData((prev) => {
        const updated = prev.filter((item) => item?.id !== value.id);
        return [
          ...updated,
          {
            ...value,
            id: value.id !== undefined ? Number(value.id) : 0,
            type: value.type !== undefined ? Number(value.type) : 0,
            section: value.section !== undefined ? value.section : "",
            dateFrom:
              value.dateFrom && isValidDate(value.dateFrom)
                ? new Date(value.dateFrom)?.toISOString()
                : "",
            dateTo:
              value.dateTo && isValidDate(value.dateTo)
                ? new Date(value.dateTo)?.toISOString()
                : "",
            driverId: value.driverId !== undefined ? value.driverId : 0,
            vehicalId:
              value.vehicalId !== undefined ? Number(value.vehicalId) : 0,
            department_id:
              value.department_id !== undefined
                ? Number(value.department_id)
                : 0,
            district_Id:
              value.district_Id !== undefined ? Number(value.district_Id) : 0,
            projectid:
              value.projectid !== undefined ? Number(value.projectid) : 0,
            userId: value.userId !== undefined ? Number(value.userId) : 0,
          },
        ];
      });
    });
    return () => subscription.unsubscribe(); // Clean up on unmount
  }, [watch, index, setFormsData]);

  useEffect(() => {
    if (planData) {
      setValue("id", planData.tempId);
      setValue("department_id", planData.departmentId);
      setValue("projectid", planData.projectId);
      setValue("type", planData.type);
      setValue("userId", planData.userId);
      setValue("section", planData.section ? planData.section : "");
      setValue("dateFrom", `${planData.dateFrom?.split("T")[0]}`);
      setValue("dateTo", `${planData.dateTo?.split("T")[0]}`);
      setValue("driverId", planData.driverId);
      setValue("vehicalId", planData.vehicleId);
      setValue("district_Id", planData.districtId);
    }
  }, [planData]);

  const verfiyForm = async () => {
    const isValid = await trigger();

    if (isValid) {
      const values = getValues();
      console.log("✅ Form Values:", values);

      notifyCreate("Form is verified ✅");
    } else {
      // Object.values(errors)?.forEach((error) => {
      //   if (error.message) {
      //     toast.error(error.message.toString());
      //   }
      // });
      notifyError("Form contains errors ❌");
    }
  };

  const checkDriver = async (
    driverId: number,
    dateFrom: string,
    dateTo: string
  ) => {
    if (!driverId || isNaN(driverId) || driverId <= 0) {
      toast.info("Please select a valid driver");
      return;
    } else if (!isValidDate(dateFrom)) {
      toast.info("Please Select dateFrom");
      return;
    } else if (!isValidDate(dateTo)) {
      toast.info("Please Select dateTo");
      return;
    } else {
      try {
        const response = await apiClient(
          `${TEMP_TOUR_PLAN_API}/check-driver??driverId=${driverId}&dateFrom=${dateFrom}&dateTo=${dateTo}`
        );

        if (response.data.available) {
          setDriverVerified(true);
          notifyCreate(response.data.message);
        } else {
          setDriverVerified(false);
          notifyError(response.data.message);
        }
        console.log(response);
      } catch (err) {
        console.log(err);
        notifyError((err as AxiosError).message);
      }
    }
  };

  const checkVehicle = async (
    vehicleId: number,
    dateFrom: string,
    dateTo: string
  ) => {
    if (!vehicleId) {
      toast.info("Please Select Vehicle");
    } else if (!isValidDate(dateFrom)) {
      toast.info("Please Select dateFrom");
      return;
    } else if (!isValidDate(dateTo)) {
      toast.info("Please Select dateTo");
      return;
    } else {
      try {
        const response = await apiClient(
          `${TEMP_TOUR_PLAN_API}/check-vehical?vehicalId=${vehicleId}&dateFrom=${dateFrom}&dateTo=${dateTo}`
        );

        if (response.data.available) {
          setVehicleVerified(true);
          toast.success(response.data.message);
        } else {
          setVehicleVerified(false);
          toast.error(response.data.message);
        }
        console.log(response);
      } catch (err) {
        console.log(err);
        notifyError((err as AxiosError).message);
      }
    }
  };

  const customStyles: StylesConfig<NumberOption, false> = {
    control: (base) => ({
      ...base,
      fontSize: "14px",
      // backgroundColor: "rgba(16, 143, 168, .1)",
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

  const defaultOption = { value: "", label: "Select" };

  const districtOptions = districts.map((district) => {
    return {
      value: district.id,
      label: district.districtName,
    };
  });

  const userNames = users.map((user) => {
    return {
      value: user.id,
      label: user.fullName,
    };
  });

  const driverNames = drivers.map((driver) => {
    return {
      value: driver.id,
      label: driver.driverName,
    };
  });

  const vehicleNumbers = vehicles.map((vehicle) => {
    return {
      value: vehicle.id,
      label: vehicle.vehicleNumber,
    };
  });

  // const dateFrom = watch("dateFrom");
  // const dateTo = watch("dateTo");
  // const driverId = watch("driverId");
  // const vehicalId = watch("vehicalId");

  // useEffect(() => {
  //   if (dateFrom && dateTo && driverId && vehicalId) {
  //     checkDriver(driverId, dateFrom, dateTo);
  //     checkVehicle(vehicalId, dateFrom, dateTo);
  //   }
  // }, [dateFrom, dateTo]);

  const copyFormData = () => {
    if (copiedFormData) {
      setCopiedFormData(undefined);
      setCopiedRowIndex(-1);
    } else {
      toast.info("Copied");
      setCopiedRowIndex(index);
      const values = getValues(); // Get all current form values
      setCopiedFormData({
        district_Id: values.district_Id,
        type: values.type,
        userId: values.userId,
        dateFrom: values.dateFrom,
        dateTo: values.dateTo,
        driverId: values.driverId,
        vehicalId: values.vehicalId,
      });
    }
  };

  const pasteFormData = (copiedFormData: TempCopyForm) => {
    if (copiedFormData) {
      setValue("type", copiedFormData.type);
      setValue("userId", copiedFormData.userId);
      setValue("dateFrom", `${copiedFormData.dateFrom?.split("T")[0]}`);
      setValue("dateTo", `${copiedFormData.dateTo?.split("T")[0]}`);
      setValue("driverId", copiedFormData.driverId);
      setValue("vehicalId", copiedFormData.vehicalId);
      setValue("district_Id", copiedFormData.district_Id);
    }
  };

  return (
    <tr
      className={dmSans.className}
      style={{
        border: ".41px solid rgba(81,81,81,0.20) !important",
        fontSize: ".85rem",
      }}
    >
      <td className={`${index === copiedRowIndex && "bg-color-light-gray"}`}>
        {index}
      </td>
      <td className={`${index === copiedRowIndex && "bg-color-light-gray"}`}>
        {planData.projectId}
      </td>
      <td className={`${index === copiedRowIndex && "bg-color-light-gray"}`}>
        {planData.gsNo}
      </td>
      <td
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        {planData.projectName}
      </td>
      <td
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        <div
          className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        >
          <Controller
            name="district_Id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={districtOptions} // must be in format { value, label }
                placeholder="Select"
                styles={customStyles}
                isClearable
                isSearchable
                menuPlacement="auto"
                menuPosition="absolute"
                menuPortalTarget={document.body}
                // Convert between react-select and raw value
                value={
                  districtOptions.find((opt) => opt.value === field.value) ||
                  null
                }
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : null);
                }}
              />
            )}
          />
          {/* <select
            {...register("districtId", { valueAsNumber: true })}
            className="form-select form-select-sm color-light-dark"
            id="districtId"
          >
            <option value="">Select</option>
            {districts.map((district) => (
              <option value={district.id}>{district.districtName}</option>
            ))}
          </select> */}
          {errors.district_Id && (
            <p className="text-danger mt-1 fs14px">
              {errors.district_Id.message}
            </p>
          )}
        </div>
      </td>
      <td className={`${index === copiedRowIndex && "bg-color-light-gray"}`}>
        {planData.sectors}
      </td>
      <td className={`${index === copiedRowIndex && "bg-color-light-gray"}`}>
        {planData.cost}
      </td>
      <td
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        <div
          className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        >
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={typeStatues} // must be in format { value, label }
                placeholder="Select"
                styles={customStyles}
                isClearable
                isSearchable
                menuPlacement="auto"
                menuPosition="absolute"
                menuPortalTarget={document.body}
                // Convert between react-select and raw value
                value={
                  typeStatues.find((opt) => opt.value === field.value) || null
                }
                onChange={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : null
                  );
                }}
              />
            )}
          />
          {/* <select
            {...register("type", { valueAsNumber: true })}
            className="form-select form-select-sm color-light-dark"
            id="type"
          >
            <option value="">Select</option>
            <option value="0">Monitoring</option>
            <option value="1">Evaluation</option>
            <option value="2">MonitoringAndCMInitiative</option>
          </select> */}
          {errors.type && (
            <p className="text-danger mt-1 fs14px">{errors.type.message}</p>
          )}
        </div>
      </td>
      <td
        className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "240px" }}
      >
        <div className={`${index === copiedRowIndex && "bg-color-light-gray"}`}>
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={userNames} // must be in format { value, label }
                placeholder="Select"
                styles={customStyles}
                isClearable
                isSearchable
                menuPlacement="auto"
                menuPosition="absolute"
                menuPortalTarget={document.body}
                // Convert between react-select and raw value
                value={
                  userNames.find((opt) => opt.value === field.value) || null
                }
                onChange={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : null
                  );
                }}
              />
            )}
          />
          {/* <select
            {...register("userId", { valueAsNumber: true })}
            className="form-select form-select-sm color-light-dark"
            id="userId"
          >
            <option value="">Select</option>
            {users?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fullName}
              </option>
            ))}
          </select> */}
          {errors.userId && (
            <p className="text-danger mt-1 fs14px">{errors.userId.message}</p>
          )}
        </div>
      </td>
      <td className={`${index === copiedRowIndex && "bg-color-light-gray"}`}>
        {planData.section}
      </td>
      <td
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        <div
          className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        >
          <input
            {...register("dateFrom")}
            id="dateFrom"
            type="date"
            className="form-control form-control-sm color-light-dark"
            placeholder="Enter dateFrom"
          />
          {errors.dateFrom && (
            <p className="text-danger mt-1 fs14px">{errors.dateFrom.message}</p>
          )}
        </div>
      </td>
      <td
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        <div
          className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        >
          <input
            {...register("dateTo")}
            id="dateTo"
            type="date"
            className="form-control form-control-sm color-light-dark"
            placeholder="Enter dateTo"
          />
          {errors.dateTo && (
            <p className="text-danger mt-1 fs14px">{errors.dateTo.message}</p>
          )}
        </div>
      </td>
      <td
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        {/* className="form-control form-control-sm border-0 bg-transparent shadow-none pt-0" */}
        <div
          className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        >
          <Controller
            name="driverId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={driverNames} // must be in format { value, label }
                placeholder="Select"
                styles={customStyles}
                isClearable
                isSearchable
                menuPlacement="auto"
                menuPosition="absolute"
                menuPortalTarget={document.body}
                // Convert between react-select and raw value
                value={
                  driverNames.find((opt) => opt.value === field.value) || null
                }
                onChange={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : null
                  );
                  if (selectedOption) {
                    const driverId = Number(selectedOption.value);
                    const { dateFrom, dateTo } = getValues();
                    checkDriver(driverId, dateFrom, dateTo);
                  }
                }}
              />
            )}
          />
          {/* <select
            {...register("driverId", {
              valueAsNumber: true,
              onChange: (e) => {
                const driverId = Number(e.target.value);
                const { dateFrom, dateTo } = getValues();
                checkDriver(driverId, dateFrom, dateTo);
              },
            })}
            className="form-select form-select-sm color-light-dark"
            id="driverId"
          >
            <option value="">Select</option>
            {drivers?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.driverName}
              </option>
            ))}
          </select> */}
          {errors.driverId && (
            <p className="text-danger mt-1 fs14px">{errors.driverId.message}</p>
          )}
        </div>
      </td>
      <td
        className={`${index === copiedRowIndex && "bg-color-light-gray"}`}
        style={{ minWidth: "220px" }}
      >
        <div
          className={`col ${index === copiedRowIndex && "bg-color-light-gray"}`}
        >
          <Controller
            name="vehicalId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={vehicleNumbers} // must be in format { value, label }
                placeholder="Select"
                styles={customStyles}
                isClearable
                isSearchable
                menuPlacement="auto"
                menuPosition="absolute"
                menuPortalTarget={document.body}
                // Convert between react-select and raw value
                value={
                  vehicleNumbers.find((opt) => opt.value === field.value) ||
                  null
                }
                onChange={(selectedOption) => {
                  field.onChange(
                    selectedOption ? Number(selectedOption.value) : null
                  );
                  if (selectedOption) {
                    const vehicleId = Number(selectedOption.value);
                    const { dateFrom, dateTo } = getValues();
                    checkVehicle(Number(vehicleId), dateFrom, dateTo);
                  }
                }}
              />
            )}
          />
          {/* <select
            {...register("vehicalId", {
              valueAsNumber: true,
              onChange: (e) => {
                const vehicleId = e.target.value;
                const { dateFrom, dateTo } = getValues();
                checkVehicle(Number(vehicleId), dateFrom, dateTo);
              },
            })}
            className="form-select form-select-sm color-light-dark"
            id="vehicalId"
          >
            <option value="">Select</option>
            {vehicles?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.vehicleNumber}
              </option>
            ))}
          </select> */}
          {errors.driverId && (
            <p className="text-danger mt-1 fs14px">{errors.driverId.message}</p>
          )}
        </div>
      </td>
      <td>
        <Button
          className="btn btn-sm bg-color-sea-green text-white "
          disabled={!isVehicleVerified || !isDriverVerified}
          onClick={verfiyForm}
        >
          Verify
        </Button>
      </td>
      <td>
        <DeleteModal
          handleDelete={() => handleDelete(planData.tempId)}
          id={index}
        />
      </td>
      <td>
        <Button
          onClick={copyFormData}
          className={`btn rounded-circle ${
            index === copiedRowIndex && "text-success"
          }`}
        >
          <MdContentCopy />
        </Button>
      </td>
      <td>
        {copiedFormData ? (
          <Button
            onClick={() => pasteFormData(copiedFormData)}
            className="btn rounded-circle"
          >
            <FaPaste />
          </Button>
        ) : (
          <Button className="btn rounded-circle" disabled>
            <FaPaste />
          </Button>
        )}
      </td>
    </tr>
  );
};

export default Form;
