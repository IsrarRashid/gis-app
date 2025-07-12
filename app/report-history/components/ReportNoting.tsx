"use client";
import { REPORTS_HISTORY_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import Spinner from "@/app/components/Spinner";
import useOfficers from "@/app/hooks/useOfficers";
import useReportHistoryUser from "@/app/hooks/useReportHistoryUsers";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { triggerEscapeKeyPress } from "@/app/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import "easymde/dist/easymde.min.css";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import HistoryList from "./HistoryList";
import { APPROVED, REFERBACK, SUBMITTED } from "../statuses";
import { SubmittedReport } from "../list/components/List";

import PdfIframe from "./pdf/PdfIframe";

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
  reportType: z.number().optional().default(1),
  sDate: z.string().optional().default(new Date().toISOString()),
});

type ReportNoting = z.infer<typeof schema>;

interface Props {
  data: SubmittedReport;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  role: string;
  userId: number;
}

export interface ReportHistory {
  id: number;
  visitId: number;
  projectId: number;
  submittedFrom: number;
  submittedTo: number;
  remarks: string;
  reportPath: string;
  status: number;
  sDate: string;
  reportType: number;
}

const ReportNoting = ({ data, setRefresh, refresh, role, userId }: Props) => {
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportNoting>({ resolver: zodResolver(schema) });
  console.log(errors);
  const { data: users } = useReportHistoryUser({ refresh });
  const { data: officers } = useOfficers({ refresh });
  const [reportsHistory, setReportsHistory] = useState<ReportHistory[]>();
  const [isSubmitting, setSubmitting] = useState(false);
  console.log("all officers", users);
  const submittedTo = watch("submittedTo");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    console.log(selectedId);

    setValue("submittedTo", selectedId);
  };

  useEffect(() => {
    if (
      role === "deputy director" &&
      reportsHistory &&
      reportsHistory[reportsHistory?.length - 1].status === APPROVED
    ) {
      setValue("submittedTo", data.intiallyUserId);
    } else if (
      role === "deputy director" &&
      reportsHistory &&
      reportsHistory[reportsHistory?.length - 1].status === REFERBACK
    ) {
      setReferback(true);
      setValue("submittedTo", data.intiallyUserId);
    } else if (
      role === "director" &&
      reportsHistory &&
      reportsHistory[reportsHistory?.length - 1].status === REFERBACK
    ) {
      setReferback(true);
      // setValue(
      //   "submittedTo",
      //   officers?.find(
      //     (officer) => officer.roleName?.toLowerCase() === "deputy director"
      //   )?.id
      // );
    }

    console.log("submittedTo", submittedTo);
  }, [
    data.submittedFrom,
    officers,
    setValue,
    submittedTo,
    role,
    reportsHistory,
  ]);

  const onSubmit = async (formData: ReportNoting) => {
    console.log(errors);
    if (role) {
      const modifiedFormData = {
        ...formData,
        visitId: data.visitId,
        projectId: data.projectId,
        submittedFrom: userId,
        submittedUser: data.intiallyUserId,
        reportPath: data.reportPath,
        status:
          role === "deputy director" &&
          data.status === SUBMITTED &&
          !isReferback
            ? SUBMITTED
            : role === "deputy director" &&
              data.status === SUBMITTED &&
              isReferback
            ? REFERBACK
            : role === "deputy director" && data.status === APPROVED
            ? APPROVED
            : role === "director" && data.status === SUBMITTED && !isReferback
            ? SUBMITTED
            : role === "director" && data.status === SUBMITTED && isReferback
            ? REFERBACK
            : role === "director" && data.status === REFERBACK && isReferback
            ? REFERBACK
            : role === "director" && data.status === APPROVED
            ? APPROVED
            : role === "director general" &&
              data.status === SUBMITTED &&
              !isReferback
            ? APPROVED
            : role === "director general" &&
              data.status === SUBMITTED &&
              isReferback
            ? REFERBACK
            : role === "deputy director" && data.status === SUBMITTED
            ? SUBMITTED
            : role === "deputy director" &&
              data.status === REFERBACK &&
              isReferback
            ? REFERBACK
            : role === "deputy director" && isReferback
            ? REFERBACK
            : role === "director" && isReferback
            ? REFERBACK
            : -999
            ? APPROVED
            : REFERBACK,
        reportType: data.reportType,
      };
      console.log("modifiedFormData", modifiedFormData);
      console.log("submittedTo", submittedTo);

      console.log("modified Form Data:", modifiedFormData);

      try {
        setSubmitting(true);
        const response = await apiClient.post(
          `${REPORTS_HISTORY_API}/MarkedReport`,
          modifiedFormData
        );
        console.log("Response:", response);
        toast.success("Report Marked Successfully");
        triggerEscapeKeyPress();
        setRefresh((prev) => !prev);
      } catch (err) {
        setSubmitting(false);
        console.log("err", err);
        console.error((err as AxiosError).message);
        toast.error("An unexpected error occured.");
      }
    }
  };

  useEffect(() => {
    const getReportHistory = async (visitId: number, projectId: number) => {
      try {
        const response = await apiClient.get(
          `${REPORTS_HISTORY_API}/GetReportHistory?visitId=${visitId}&ProjectId=${projectId}`
        );
        setReportsHistory(response.data.data);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    console.log("visit id:", data.visitId, "project id", data.projectId);
    getReportHistory(data.visitId, data.projectId);
  }, [data]);

  useEffect(() => {
    if (reportsHistory) {
      console.log("reportsHistory", reportsHistory);
      console.log(
        "test 1",
        reportsHistory[reportsHistory?.length - 1].status === SUBMITTED
      );
    }
  }, [reportsHistory]);

  const [isReferback, setReferback] = useState<boolean>(false);
  const [isMarked, setMarked] = useState<boolean>(false);
  const [viewPdf, setViewPdf] = useState<boolean>(false);

  return (
    <div className="container-fluid p-3">
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
          {reportsHistory && (
            <div className="row d-flex m-0">
              {viewPdf && (
                <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                  {/* <PdfFileViewer /> */}
                  <PdfIframe
                    key={data.reportPath}
                    reportPath={`${process.env.NEXT_PUBLIC_BACKEND_API}${data.reportPath}`}
                  />
                  {/* <EditPdfFileViewer
                fileUrl={`${process.env.NEXT_PUBLIC_BACKEND_API}${data.reportPath}`}
              /> */}
                </div>
              )}
              <div
                className={`${
                  viewPdf ? "col-lg-6" : "col-lg-12"
                } col-md-12 col-sm-12`}
                style={{ height: "85%", overflow: "scroll" }}
              >
                <Button
                  className="btn btn-primary"
                  onClick={() => setViewPdf(!viewPdf)}
                >
                  {viewPdf ? "Hide" : "View"} PDF
                </Button>
                <HistoryList data={reportsHistory} />
                <div
                  className="col p-4 ms-1 mb-3"
                  style={{
                    background: "#FAFAFA",
                    borderRadius: "12px",
                  }}
                >
                  <p className="mb-4 fw-normal">
                    <span>Project:&nbsp;&nbsp;</span> {data.projectName}
                  </p>
                  <hr style={{ opacity: ".1" }} />
                  <>
                    {reportsHistory[reportsHistory?.length - 1].submittedTo ===
                      userId &&
                    (reportsHistory[reportsHistory?.length - 1].status ===
                      SUBMITTED ||
                      reportsHistory[reportsHistory?.length - 1].status ===
                        REFERBACK ||
                      reportsHistory[reportsHistory?.length - 1].status ===
                        APPROVED) ? (
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
                                  className="custom-editor"
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

                          <div className="row mx-0 mb-3">
                            {role !== "director" &&
                              (data.status === SUBMITTED ||
                                data.status === REFERBACK) && (
                                <div className="col">
                                  <div className="form-check">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="reject"
                                      checked={isReferback}
                                      onChange={() => {
                                        setReferback(!isReferback);
                                        setMarked(false);
                                        role === "deputy director"
                                          ? setValue(
                                              "submittedTo",
                                              reportsHistory[
                                                reportsHistory?.length - 1
                                              ].status === REFERBACK
                                                ? data.intiallyUserId
                                                : data.submittedFrom
                                            )
                                          : setValue(
                                              "submittedTo",
                                              data.submittedFrom
                                            );
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="reject"
                                    >
                                      Referback:{" "}
                                      {role === "deputy director" &&
                                      reportsHistory[reportsHistory?.length - 1]
                                        .status === REFERBACK
                                        ? users.find(
                                            (user) =>
                                              user.id === data.intiallyUserId
                                          )?.fullName
                                        : role === "director" &&
                                          reportsHistory[
                                            reportsHistory?.length - 1
                                          ].status === REFERBACK
                                        ? officers.find(
                                            (officer) =>
                                              officer.roleName?.toLowerCase() ===
                                              "deputy director"
                                          )?.fullName
                                        : users.find(
                                            (user) =>
                                              user.id === data.submittedFrom
                                          )?.fullName}
                                    </label>
                                  </div>
                                </div>
                              )}
                            {role === "director" && (
                              <div className="mb-2">
                                <select
                                  value={submittedTo || ""}
                                  onChange={(e) => {
                                    handleSelectChange(e);
                                    setReferback(true);
                                    setMarked(false);
                                  }}
                                  className="form-select fs-6"
                                  aria-label="Select Deputy Director"
                                >
                                  <option value="">
                                    Select Deputy Director
                                  </option>
                                  {officers
                                    .filter(
                                      (officer) =>
                                        officer.roleName?.toLowerCase() ===
                                        "deputy director"
                                    )
                                    .map((officer) => (
                                      <option
                                        key={officer.id}
                                        value={officer.id}
                                      >
                                        {officer.designation}
                                      </option>
                                    ))}
                                </select>
                                {errors.submittedTo && (
                                  <p className="text-danger mt-1">
                                    {errors.submittedTo.message}
                                  </p>
                                )}
                              </div>
                            )}
                            {role === "director" &&
                              reportsHistory[reportsHistory?.length - 1]
                                .status !== APPROVED &&
                              reportsHistory[reportsHistory?.length - 1]
                                .status !== REFERBACK && (
                                <div className="col">
                                  <div className="form-check">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      id="mark"
                                      checked={isMarked}
                                      onChange={() => {
                                        const newValue = !isMarked;
                                        setMarked(newValue);
                                        setReferback(false);
                                        console.log(
                                          "officer 47 index",
                                          officers[47].designation
                                        );

                                        if (newValue) {
                                          setValue(
                                            "submittedTo",
                                            officers[47].id
                                          ); //director general-id
                                        } else {
                                          setValue("submittedTo", undefined); //director general-id
                                        }
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="mark"
                                    >
                                      {/* Mark To: {officers[4]?.fullName} */}
                                      Mark To: DIRECTOR GENERAL
                                    </label>
                                  </div>
                                </div>
                              )}
                          </div>

                          {!isReferback && !isMarked && (
                            <>
                              {(role === "deputy director" &&
                                reportsHistory[reportsHistory?.length - 1]
                                  .status === SUBMITTED) ||
                              (role === "director" &&
                                reportsHistory[reportsHistory?.length - 1]
                                  .status === SUBMITTED) ||
                              (role === "director" &&
                                reportsHistory[reportsHistory?.length - 1]
                                  .status === APPROVED) ||
                              (role === "director general" &&
                                reportsHistory[reportsHistory?.length - 1]
                                  .status === SUBMITTED) ? (
                                <div className="mb-2">
                                  <select
                                    value={submittedTo || ""}
                                    onChange={handleSelectChange}
                                    className="form-select fs-6"
                                    aria-label="Select Director"
                                  >
                                    {role === "director" ? (
                                      <>
                                        <option value="">
                                          Select Deputy Director
                                        </option>
                                        <option value={officers[27]?.id}>
                                          {officers[27]?.designation}
                                        </option>
                                        <option value={officers[28]?.id}>
                                          {officers[28]?.designation}
                                        </option>
                                      </>
                                    ) : (
                                      <>
                                        <option value="">
                                          Select Director
                                        </option>
                                        <option value={officers[25]?.id}>
                                          {officers[25]?.designation}
                                        </option>
                                        <option value={officers[26]?.id}>
                                          {officers[26]?.designation}
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
                                      (user) => user.id === data.intiallyUserId
                                    )?.fullName
                                  }
                                </p>
                              )}
                            </>
                          )}
                          <div className="row d-flex justify-content-end m-0">
                            {!isReferback && (
                              <>
                                {role === "deputy director" && (
                                  <div className="col-auto">
                                    <Button
                                      disabled={isSubmitting || !submittedTo}
                                      type="submit"
                                      className="btn rounded-pill fs18px fw-normal px-3"
                                      style={{
                                        background: `${
                                          submittedTo
                                            ? "rgba(0, 57, 206,.05)"
                                            : "rgba(201, 201, 201,.5)"
                                        }`,
                                        color: `${
                                          submittedTo ? "#0039CE" : "#454545"
                                        }`,
                                      }}
                                    >
                                      Reviewed & Forward To{" "}
                                      {isSubmitting && <Spinner />}
                                    </Button>
                                  </div>
                                )}
                                {(role === "director" ||
                                  role === "director general") && (
                                  <div className="col-auto">
                                    <Button
                                      disabled={isSubmitting || !submittedTo}
                                      type="submit"
                                      className="btn rounded-pill fs18px fw-normal px-3"
                                      style={{
                                        background: `${
                                          submittedTo
                                            ? "rgba(0, 57, 206,.05)"
                                            : "rgba(201, 201, 201,.5)"
                                        }`,
                                        color: `${
                                          submittedTo ? "#0039CE" : "#454545"
                                        }`,
                                      }}
                                    >
                                      {isMarked ? "For Approval" : "Approved"}{" "}
                                      {isSubmitting && <Spinner />}
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}

                            {isReferback && (
                              <div className="col-auto">
                                <Button
                                  disabled={isSubmitting || !submittedTo}
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportNoting;
