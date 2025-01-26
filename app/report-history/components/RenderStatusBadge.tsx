import { GoCheckCircleFill, GoXCircleFill } from "react-icons/go";
import {
  ASSISTANT_DIRECTOR_ISSUED_ID,
  ASSISTANT_DIRECTOR_RESUBMITTED_ID,
  ASSISTANT_DIRECTOR_SUBMITTED_ID,
  DEPUTY_DIRECTOR_APPROVED_AND_ALLOW_ISSUE_ID,
  DEPUTY_DIRECTOR_APPROVED_ID,
  DEPUTY_DIRECTOR_REFERBACK_ID,
  DIRECTOR_APPROVED_ID,
  DIRECTOR_REFERBACK_ID,
} from "./List";

const RenderStatusBadge = ({ status }: { status: number }) => {
  return (
    <>
      {status === ASSISTANT_DIRECTOR_SUBMITTED_ID ? (
        <p
          className="py-2 mb-0 px-3 rounded-pill"
          style={{ background: "#E3F0E7" }}
        >
          <GoCheckCircleFill className="bg-white text-success rounded-circle mb-1" />{" "}
          Submitted by Assistant Director (BS-17)
        </p>
      ) : status === DEPUTY_DIRECTOR_APPROVED_ID ? (
        <p
          className="py-2 mb-0 px-3 rounded-pill"
          style={{ background: "#E3F0E7" }}
        >
          <GoCheckCircleFill className="bg-white text-success rounded-circle mb-1" />{" "}
          Approved by Deputy Director (BS-18)
        </p>
      ) : status === DIRECTOR_APPROVED_ID ? (
        <p
          className="py-2 mb-0 px-3 rounded-pill"
          style={{ background: "#E3F0E7" }}
        >
          <GoCheckCircleFill className="bg-white text-success rounded-circle mb-1" />{" "}
          Approved by Director (BS-19)
        </p>
      ) : status === DEPUTY_DIRECTOR_APPROVED_AND_ALLOW_ISSUE_ID ? (
        <p
          className="py-2 mb-0 px-3 rounded-pill"
          style={{ background: "#E3F0E7" }}
        >
          <GoCheckCircleFill className="bg-white text-success rounded-circle mb-1" />{" "}
          Approved and Issued by Deputy Director (BS-18)
        </p>
      ) : status === ASSISTANT_DIRECTOR_ISSUED_ID ? (
        <p
          className="py-2 mb-0 px-3 rounded-pill"
          style={{ background: "#E3F0E7" }}
        >
          <GoCheckCircleFill className="bg-white text-success rounded-circle mb-1" />{" "}
          Issued by Assistant Director (BS-17)
        </p>
      ) : status === DEPUTY_DIRECTOR_REFERBACK_ID ? (
        <p
          className="py-2 mb-0 px-3 rounded-pill"
          style={{ background: "#E3F0E7" }}
        >
          <GoXCircleFill className="bg-white text-danger rounded-circle mb-1" />{" "}
          Referback by Deputy Director (BS-18)
        </p>
      ) : status === DIRECTOR_REFERBACK_ID ? (
        <p
          className="py-2 mb-0 px-3 rounded-pill"
          style={{ background: "#E3F0E7" }}
        >
          <GoXCircleFill className="bg-white text-danger rounded-circle mb-1" />{" "}
          Referback by Director (BS-19)
        </p>
      ) : status === ASSISTANT_DIRECTOR_RESUBMITTED_ID ? (
        <p
          className="py-2 mb-0 px-3 rounded-pill"
          style={{ background: "#E3F0E7" }}
        >
          <GoXCircleFill className="bg-white text-danger rounded-circle mb-1" />{" "}
          Resubmitted by Assistant Director (BS-17)
        </p>
      ) : (
        ""
      )}
    </>
  );
};

export default RenderStatusBadge;
