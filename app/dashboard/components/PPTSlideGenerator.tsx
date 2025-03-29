"use client";

import { generateReportPPTAPI } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal";
import Spinner from "@/app/components/Spinner";
import apiClient, {
  AxiosError,
  ErrorResponse,
} from "@/app/services/api-client";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const PPTSlideGenerator = () => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [slidePath, setSlidePath] = useState<string>("");
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [isSubmitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("fromDate", new Date(fromDate).toLocaleDateString("en-US"));
    console.log("toDate", new Date(toDate).toLocaleDateString("en-US"));
    try {
      setSubmitting(true);
      const response = await apiClient.post(
        `${generateReportPPTAPI}?from=${new Date(fromDate).toLocaleDateString(
          "en-US"
        )}&to=${new Date(toDate).toLocaleDateString("en-US")}`
      );

      console.log(response);
      toast.success("PPT Generated Successfully");
      setSlidePath(
        process.env.NEXT_PUBLIC_BACKEND_API + "/" + response.data.data
      );
      setSubmitted(true);
    } catch (err) {
      setSubmitting(false);
      console.error("Submission error:", err);
      toast.error(
        (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
          (err as AxiosError<ErrorResponse>).message
      );
    }
  };

  useEffect(() => {
    if (isSubmitting) setSubmitting(false);
  }, [isSubmitted]);

  useEffect(() => {
    if (slidePath) {
      window.open(slidePath, "_blank");
    }
  }, [slidePath]);

  return (
    <CustomModal
      HeaderTopPos={0}
      HeaderRightPos={0}
      size="lg"
      modalId="ppt-modal"
      buttonColumn="col-auto"
      button={
        <Button
          className={`btn col-auto py-2 shadow-none mb-2 me-2 text-light`}
          style={{
            background: `#fcb103`,
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px",
          }}
        >
          Generate PPT Slide
        </Button>
      }
      body={
        <div className="bg-white rounded-3 p-4">
          <h3 className="fw-bold text-center">Generate PPT Slide</h3>
          <form onSubmit={handleSubmit}>
            <div className="d-flex">
              <div className="col mb-3 p-2">
                <label htmlFor="fromDate" className="form-label">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="form-control"
                  id="fromDate"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="col mb-3 p-2">
                <label htmlFor="toDate" className="form-label">
                  To Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                Generate {isSubmitting && <Spinner />}
              </button>
            </div>
          </form>
        </div>
      }
    />
  );
};

export default PPTSlideGenerator;
