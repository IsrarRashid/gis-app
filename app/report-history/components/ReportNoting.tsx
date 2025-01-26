"use client";
import { reportsHistoryAPI } from "@/app/APIs";
import Button from "@/app/components/Button";
import Spinner from "@/app/components/Spinner";
import useOfficers from "@/app/hooks/useOfficers";
import useProjects from "@/app/hooks/useProjects";
import useReportHistoryUser from "@/app/hooks/useReportHistoryUsers";
import apiClient, { AxiosError } from "@/app/services/api-client";
import {
  addDayToFormattedDate,
  getFormattedDate,
  triggerEscapeKeyPress,
} from "@/app/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import "easymde/dist/easymde.min.css";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5";
import { z } from "zod";
import HistoryList from "./HistoryList";
import {
  ASSISTANT_DIRECTOR_SUBMITTED_ID,
  DEPUTY_DIRECTOR_APPROVED_AND_ALLOW_ISSUE_ID,
  DEPUTY_DIRECTOR_APPROVED_ID,
  DEPUTY_DIRECTOR_REFERBACK_ID,
  DIRECTOR_APPROVED_ID,
  DIRECTOR_REFERBACK_ID,
  ONE_PAGER_REPORT_ID,
  ReportHistory,
} from "./List";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const schema = z.object({
  id: z.number().optional().default(0),
  visitId: z.number().optional().default(-1),
  projectId: z.number().optional().default(-1),
  submittedFrom: z.number().optional().default(-1),
  submittedUser: z.number().optional().default(-1),
  submittedTo: z
    .number({ invalid_type_error: "Please select Director!" })
    .optional(),
  remarks: z.string().min(1, { message: "Please add Remarks!" }),
  reportPath: z.string().optional().default(""),
  lastStatus: z.number().optional().default(-1),
  status: z.number().optional().default(-1),
  reportType: z.number().optional().default(-1),
  sDate: z.string().optional().default(new Date().toISOString()),
});

type ReportNoting = z.infer<typeof schema>;

interface Props {
  data: ReportHistory;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}

const ReportNoting = ({ data, setRefresh, refresh }: Props) => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportNoting>({ resolver: zodResolver(schema) });
  console.log(errors);
  const { data: users } = useReportHistoryUser({ refresh });
  const { data: projects } = useProjects({ refresh });
  const { data: officers } = useOfficers({ refresh });
  const [reportsHistory, setReportsHistory] = useState<ReportHistory[]>();
  const [isSubmitting, setSubmitting] = useState(false);

  const router = useRouter();

  const onSubmit = async (formData: ReportNoting) => {
    console.log(errors);
    const modifiedFormData = {
      ...formData,
      visitId: data.visitId,
      projectId: data.projectId,
      submittedFrom: userId,
      submittedUser: data.submittedUser,
      reportPath: data.reportPath,
      status:
        role &&
        role.toLowerCase() === "deputy director" &&
        data.lastStatus === ASSISTANT_DIRECTOR_SUBMITTED_ID &&
        !isRejected
          ? DEPUTY_DIRECTOR_APPROVED_ID
          : role &&
            role.toLowerCase() === "deputy director" &&
            data.lastStatus === ASSISTANT_DIRECTOR_SUBMITTED_ID &&
            isRejected
          ? DEPUTY_DIRECTOR_REFERBACK_ID
          : role &&
            role.toLowerCase() === "director" &&
            data.lastStatus === DEPUTY_DIRECTOR_APPROVED_ID &&
            !isRejected
          ? DIRECTOR_APPROVED_ID
          : role &&
            role.toLowerCase() === "director" &&
            data.lastStatus === DEPUTY_DIRECTOR_APPROVED_ID &&
            isRejected
          ? DIRECTOR_REFERBACK_ID
          : role &&
            role.toLowerCase() === "deputy director" &&
            data.lastStatus === DIRECTOR_APPROVED_ID
          ? DEPUTY_DIRECTOR_APPROVED_AND_ALLOW_ISSUE_ID
          : role &&
            role.toLowerCase() === "deputy director" &&
            data.lastStatus === DIRECTOR_REFERBACK_ID &&
            isRejected
          ? DEPUTY_DIRECTOR_REFERBACK_ID
          : role && role.toLowerCase() === "deputy director" && isRejected
          ? data.lastStatus === DEPUTY_DIRECTOR_REFERBACK_ID
          : role && role.toLowerCase() === "director" && isRejected
          ? data.lastStatus === DIRECTOR_REFERBACK_ID
          : -999
          ? DEPUTY_DIRECTOR_APPROVED_AND_ALLOW_ISSUE_ID
          : DEPUTY_DIRECTOR_REFERBACK_ID,
      reportType: data.reportType,
    };
    console.log("modified Form Data:", modifiedFormData);

    try {
      setSubmitting(true);
      const response = await apiClient.post(
        `${reportsHistoryAPI}/MarkedReport`,
        modifiedFormData
      );
      console.log("Response:", response);
      toast.success("Report Marked Successfully");
      triggerEscapeKeyPress();
      setRefresh((prev) => !prev);
    } catch (err) {
      setSubmitting(false);
      console.error((err as AxiosError).message);
      toast.error("An unexpected error occured.");
    }
  };

  // const handleMarkedReport = async (data: ReportHistory) => {
  //   try {
  //     const response = await apiClient.post(
  //       `${reportsHistoryAPI}/MarkedReport`,
  //       data
  //     );
  //     console.log("marked report: ", response.data.data);
  //   } catch (err) {
  //     console.error("Submission error:", err);
  //   }
  // };

  useEffect(() => {
    const getReportHistory = async (visitId: number, projectId: number) => {
      try {
        const response = await apiClient.get(
          `${reportsHistoryAPI}/GetReportHistory?visitId=${visitId}&ProjectId=${projectId}`
        );
        setReportsHistory(response.data.data);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    console.log("visit id:", data.visitId, "project id", data.projectId);
    getReportHistory(data.visitId, data.projectId);
  }, [data]);

  const [userId, setUserId] = useState<number>();
  const [role, setRole] = useState<string>();
  const [isRejected, setRejected] = useState<boolean>(false);

  useEffect(() => {
    const id = Cookies.get("userId");
    const role = Cookies.get("role");
    if (id) setUserId(parseInt(id));
    if (role) setRole(role);
  }, []);

  return (
    <div className="container-fluid p-3">
      <div>
        <Toaster />
      </div>
      <div
        className="col"
        style={{
          backgroundImage: "url('/images/bg2.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          border: "1px solid rgba(255, 255, 255, 0.29)",
          borderRadius: "15px",
          height: "100%",
        }}
      >
        <div
          className="col"
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, rgba(239, 239, 239,.6) , rgba(255, 255, 255,.08))",
            borderRadius: "15px",
            padding: "34px 50px",
            width: "100%",
            height: "100%",
          }}
        >
          <div className="row d-flex m-0">
            <div className="col-lg-4 col-md-12 col-sm-12 mb-3">
              <div
                className="col p-4 me-1"
                style={{
                  background: "#FAFAFA",
                  borderRadius: "12px",
                }}
              >
                <div className="row d-flex m-0 mb-2">
                  {/* <div className="col">
                  <Image src={pencil} alt="pencil" width={33} height={33} />
                </div> */}
                  <div className="col text-end">
                    <Link
                      target="_blank"
                      href={`${process.env.NEXT_PUBLIC_BACKEND_API}${data.reportPath}`}
                      className="btn rounded-pill fs15px text-wrap"
                      style={{ background: "#E4E4E4" }}
                    >
                      Veiw{" "}
                      {data.reportType === ONE_PAGER_REPORT_ID
                        ? "One Pager"
                        : "Complete"}{" "}
                      Report
                    </Link>
                  </div>
                </div>
                <h1
                  className="fw-bold text-wrap text-break"
                  style={{ fontSize: "36px" }}
                >
                  {
                    users.find((user) => user.id === data.submittedFrom)
                      ?.fullName
                  }
                </h1>
                <p
                  className="mb-2 fs18px fw-normal"
                  style={{ color: "#1E1E1E", opacity: 0.8 }}
                >
                  {
                    users.find((user) => user.id === data.submittedFrom)
                      ?.designation
                  }
                </p>
                {/* <p
                className="mb-2 fs18px fw-normal"
                style={{ color: "#1E1E1E", opacity: 0.8 }}
              >
                Submitted To :{" "}
                {users.find((user) => user.id === data.submittedTo)?.userName}
              </p> */}
                <p
                  className="mb-2 fs18px fw-normal"
                  style={{ color: "#1E1E1E", opacity: 0.8 }}
                >
                  Marked To :{" "}
                  {users.find((user) => user.id === data.submittedTo)?.fullName}
                </p>
                <hr className="mb-3" style={{ opacity: ".1" }} />
                <div className="row d-flex m-0 mb-2">
                  <div className="col">
                    <p
                      className="mb-1 fw-normal text-break"
                      style={{ color: "#1E1E1E", opacity: 0.6 }}
                    >
                      Last modification:&nbsp;
                      {addDayToFormattedDate(
                        getFormattedDate(new Date(data.sDate), "short")!
                      )}
                    </p>
                  </div>
                  {/* <div className="col-auto">
                    <CustomModal
                      isFullscreen={true}
                      modalId="viewHistory"
                      button={
                        <Button
                          onClick={() =>
                            handleViewHistory(data.visitId, data.projectId)
                          }
                          className="btn text-decoration-none rounded-pill"
                          style={{ color: "#0039CE" }}
                        >
                          View History
                        </Button>
                      }
                      body={
                        reportsHistory && <Temporary data={reportsHistory} />
                      }
                    />
                  </div> */}
                </div>
                <Button className="btn bg-color-sea-blue fs18px rounded-pill text-white w-100 py-3 mb-2 fw-bold">
                  <IoArrowBack size={21} />
                  &nbsp;&nbsp;&nbsp;Back
                </Button>
                {/* <Button
                className="btn fs18px rounded-pill w-100 py-3 mb-2 fw-bold"
                style={{ background: "rgba(38, 50, 56,.05)" }}
              >
                <IoArrowBack size={21} />
                &nbsp;&nbsp;&nbsp;Back
              </Button> */}
              </div>
            </div>
            <div
              className="col-lg-8 col-md-12 col-sm-12"
              style={{ height: "85%", overflow: "scroll" }}
            >
              {reportsHistory && <HistoryList data={reportsHistory} />}
              <div
                className="col p-4 ms-1 mb-3"
                style={{
                  background: "#FAFAFA",
                  borderRadius: "12px",
                }}
              >
                <p className="mb-4 fw-normal">
                  <span>Project:&nbsp;&nbsp;</span>{" "}
                  {
                    projects.find((project) => project.id === data.projectId)
                      ?.name
                  }
                </p>
                <hr style={{ opacity: ".1" }} />
                {reportsHistory && role && (
                  <>
                    {(role.toLowerCase() === "deputy director" &&
                      reportsHistory[reportsHistory?.length - 1].status ===
                        ASSISTANT_DIRECTOR_SUBMITTED_ID) ||
                    (role.toLowerCase() === "deputy director" &&
                      reportsHistory[reportsHistory?.length - 1].status ===
                        DIRECTOR_APPROVED_ID) ||
                    (role.toLowerCase() === "deputy director" &&
                      reportsHistory[reportsHistory?.length - 1].status ===
                        DIRECTOR_REFERBACK_ID) ||
                    (role.toLowerCase() === "director" &&
                      reportsHistory[reportsHistory?.length - 1].status ===
                        DEPUTY_DIRECTOR_APPROVED_ID) ? (
                      <>
                        <p className="mb-1 fw-normal fs18px">
                          Description Level
                        </p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="mb-2">
                            <Controller
                              name="remarks"
                              control={control}
                              render={({ field }) => (
                                <SimpleMDE
                                  placeholder="Description"
                                  {...field}
                                />
                              )}
                            />
                            {errors.remarks && (
                              <p className="text-danger mt-1">
                                {errors.remarks.message}
                              </p>
                            )}
                          </div>
                          {data.lastStatus !== DIRECTOR_APPROVED_ID && (
                            <div className="col mb-3">
                              <div
                                className="btn-group"
                                role="group"
                                aria-label="Basic checkbox toggle button group"
                              >
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="reject"
                                  onChange={() => {
                                    setRejected(!isRejected);
                                    role.toLowerCase() === "deputy director" &&
                                      setValue(
                                        "submittedTo",
                                        reportsHistory[
                                          reportsHistory?.length - 1
                                        ].status === DIRECTOR_REFERBACK_ID
                                          ? data.submittedUser
                                          : data.submittedFrom
                                      );
                                  }}
                                />
                                <label
                                  className="btn btn-outline-primary"
                                  htmlFor="reject"
                                >
                                  Submit To:{" "}
                                  {role.toLowerCase() === "deputy director" &&
                                  reportsHistory[reportsHistory?.length - 1]
                                    .status === DIRECTOR_REFERBACK_ID
                                    ? users.find(
                                        (user) => user.id === data.submittedUser
                                      )?.fullName
                                    : users.find(
                                        (user) => user.id === data.submittedFrom
                                      )?.fullName}
                                </label>
                              </div>
                            </div>
                          )}
                          {!isRejected && (
                            <>
                              {(role.toLowerCase() === "deputy director" &&
                                reportsHistory[reportsHistory?.length - 1]
                                  .status ===
                                  ASSISTANT_DIRECTOR_SUBMITTED_ID) ||
                              (role.toLowerCase() === "deputy director" &&
                                reportsHistory[reportsHistory?.length - 1]
                                  .status === DIRECTOR_REFERBACK_ID) ||
                              (role.toLowerCase() === "director" &&
                                reportsHistory[reportsHistory?.length - 1]
                                  .status === DEPUTY_DIRECTOR_APPROVED_ID) ? (
                                <div className="mb-2">
                                  <select
                                    defaultValue={
                                      officers.find(
                                        (officer) =>
                                          officer.id === data.submittedFrom
                                      )?.id
                                    }
                                    className="form-select fs-6"
                                    aria-label="Select Director"
                                    {...register("submittedTo", {
                                      valueAsNumber: true,
                                    })}
                                  >
                                    {role.toLowerCase() === "director" ? (
                                      <>
                                        <option value="" selected>
                                          Select Deputy Director
                                        </option>
                                        <option value={officers[2]?.id}>
                                          {officers[2]?.fullName}
                                        </option>
                                        <option value={officers[3]?.id}>
                                          {officers[3]?.fullName}
                                        </option>
                                      </>
                                    ) : (
                                      <>
                                        <option value="" selected>
                                          Select Director
                                        </option>
                                        <option value={officers[0]?.id}>
                                          {officers[0]?.fullName}
                                        </option>
                                        <option value={officers[1]?.id}>
                                          {officers[1]?.fullName}
                                        </option>
                                      </>
                                    )}
                                  </select>
                                  {errors.submittedTo && (
                                    <p className="text-danger mt-1">
                                      {errors.submittedTo.message}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="mb-0">
                                  Submitted To:{" "}
                                  {
                                    users.find(
                                      (user) => user.id === data.submittedUser
                                    )?.fullName
                                  }
                                </p>
                              )}
                            </>
                          )}
                          <div className="row d-flex justify-content-end m-0">
                            {!isRejected && (
                              <>
                                {userId &&
                                  role.toLowerCase() === "deputy director" && (
                                    <div className="col-auto">
                                      <Button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="btn rounded-pill fs18px fw-normal px-3"
                                        style={{
                                          background: "rgba(0, 57, 206,.05)",
                                        }}
                                      >
                                        Approved & Mark To{" "}
                                        {isSubmitting && <Spinner />}
                                      </Button>
                                    </div>
                                  )}
                                {userId &&
                                  role.toLowerCase() === "director" && (
                                    <div className="col-auto">
                                      <Button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="btn rounded-pill fs18px fw-normal"
                                        style={{
                                          background: "rgba(0, 57, 206,.05)",
                                        }}
                                      >
                                        Approved {isSubmitting && <Spinner />}
                                      </Button>
                                    </div>
                                  )}
                              </>
                            )}

                            {isRejected && (
                              <div className="col-auto pe-0">
                                <Button
                                  disabled={isSubmitting}
                                  className="btn rounded-pill fs18px fw-normal px-3"
                                  type="submit"
                                  style={{
                                    background: "rgba(0, 57, 206,.05)",
                                    color: "#0039CE",
                                  }}
                                >
                                  Referback {isSubmitting && <Spinner />}
                                </Button>
                              </div>
                            )}
                          </div>
                        </form>
                      </>
                    ) : (
                      "Response Submitted"
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportNoting;
