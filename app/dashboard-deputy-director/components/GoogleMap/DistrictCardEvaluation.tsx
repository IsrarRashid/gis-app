import approved from "@/public/icons/evaluation/approved.svg";
import dropped from "@/public/icons/evaluation/dropped.svg";
import unApproved from "@/public/icons/evaluation/unApproved.svg";
import Image from "next/image";
import { ProgressBar } from "react-bootstrap";
import { DistrictList } from "../Dashboard";

interface Props {
  data: DistrictList;
}

const DistrictCardEvaluation = ({ data }: Props) => {
  return (
    <div
      style={{
        // backgroundImage: "url(/images/evaluation/districtCardBg3.png)",
        // backgroundRepeat: "no-repeat",
        // backgroundSize: "100% 100%",
        // backgroundPosition: "center",
        borderRadius: "7px",

        border: ".5px solid rgba(255, 255, 255, 0.66)",
      }}
    >
      <div
        className="district-card-bg-blur"
        style={{
          borderRadius: "7px",
          padding: "16px",
        }}
      >
        <div className="row justify-content-between mb-2">
          <div className="col-auto fw-bold fs-6">{data.divisionName}</div>
          <div
            className="col-auto fw-normal fs14px"
            style={{ color: "#0C8CE9" }}
          >
            {data.districtName}
          </div>
        </div>
        <div className="col mb-2" style={{ width: "400px" }}>
          <div className="row m-0 gap-2 fs-6">
            <div
              className="col shadow-sm mb-2 py-2 px-3 d-flex rounded-pill"
              style={{
                border: ".7px solid rgba(255, 255, 255, 0.5)",
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 255, 255, 0.4) , rgba(255, 255, 255, 0.01))",
              }}
            >
              <Image src={approved} alt="approved" width={40} height={40} />
              &nbsp;
              <div className="col">
                <p className="m-0 fw-6">{data.approved}</p>
                <p
                  className="m-0 fw-5 fs14px"
                  style={{ color: "rgba(0, 0, 0, 0.78)" }}
                >
                  Approved
                </p>
              </div>
            </div>
            <div
              className="col shadow-sm mb-2 py-2 px-3 d-flex rounded-pill"
              style={{
                border: ".7px solid rgba(255, 255, 255, 0.5)",
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 255, 255, 0.4) , rgba(255, 255, 255, 0.01))",
              }}
            >
              <Image src={unApproved} alt="unApproved" width={40} height={40} />
              &nbsp;
              <div className="col">
                <p className="m-0 fw-6">{data.unApproved}</p>
                <p
                  className="m-0 fw-5 fs14px"
                  style={{ color: "rgba(0, 0, 0, 0.78)" }}
                >
                  Unapproved
                </p>
              </div>
            </div>
          </div>
          <div className="row m-0 gap-2 fs-6">
            <div
              className="col shadow-sm mb-2 py-2 px-3 d-flex rounded-pill"
              style={{
                border: ".7px solid rgba(255, 255, 255, 0.5)",
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 255, 255, 0.4) , rgba(255, 255, 255, 0.01))",
              }}
            >
              <Image src={dropped} alt="dropped" width={40} height={40} />
              &nbsp;
              <div className="col">
                <p className="m-0 fw-6">{data.dropped}</p>
                <p
                  className="m-0 fw-5 fs14px"
                  style={{ color: "rgba(0, 0, 0, 0.78)" }}
                >
                  Dropped Projects
                </p>
              </div>
            </div>
            <div
              className="col shadow-sm mb-2 py-2 px-3 d-flex rounded-pill"
              style={{
                border: ".7px solid rgba(255, 255, 255, 0.5)",
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 255, 255, 0.4) , rgba(255, 255, 255, 0.01))",
              }}
            >
              <Image src={dropped} alt="dropped" width={40} height={40} />
              &nbsp;
              <div className="col">
                <p className="m-0 fw-6">{data.dropped}</p>
                <p
                  className="m-0 fw-5 fs14px"
                  style={{ color: "rgba(0, 0, 0, 0.78)" }}
                >
                  PC (IV)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <ProgressBar className="bg-transparent">
            <ProgressBar
              variant="success"
              now={data.good}
              max={1}
              key={1}
              label={`Successful`}
              className="bg-transparent text-dark fw-5"
            />
            <ProgressBar
              variant="warning"
              now={data.average}
              max={1}
              key={2}
              label={`Partial Success`}
              className="bg-transparent text-dark fw-5"
            />
            <ProgressBar
              variant="danger"
              now={data.crtical}
              max={1}
              key={3}
              label={`Not Sucessfull`}
              className="bg-transparent text-dark fw-5"
            />
          </ProgressBar>

          <ProgressBar className="rounded-pill">
            <ProgressBar
              variant="success"
              now={data.good}
              max={1}
              key={4}
              className="rounded-pill fw-5"
              label={`${data.good}`}
              style={{
                backgroundImage: "linear-gradient(to top, #6EBD18 , #7ED321)",
              }}
            />
            <ProgressBar
              variant="warning"
              now={data.average}
              max={1}
              key={5}
              className="rounded-pill fw-5"
              label={`${data.average}`}
              style={{
                backgroundImage: "linear-gradient(to top, #F0B30F , #FDCA40)",
              }}
            />
            <ProgressBar
              variant="danger"
              now={data.crtical}
              max={1}
              key={6}
              className="rounded-pill fw-5"
              label={`${data.crtical}`}
              style={{
                backgroundImage: "linear-gradient(to top, #BE1707 , #D62C2C)",
              }}
            />
          </ProgressBar>
        </div>
        {/* <div
        className="row d-flex m-1 mb-0 fw-normal fs-6"
        style={{ letterSpacing: 1 }}
      >
        <div className="col fw-bold">Division</div>
        <div className="col text-end color-sea-blue fs-6 fw-bold">Division</div>
      </div>
      <div
        className="row d-flex m-1 fw-normal fs-6"
        style={{ letterSpacing: 1 }}
      >
        <div className="col" style={{ whiteSpace: "nowrap" }}>
          {data?.districtName}
        </div>
        <div
          className="col text-end color-sea-blue fs-6"
          style={{ whiteSpace: "nowrap" }}
        >
          {data?.divisionName}
        </div>
      </div> */}
      </div>
    </div>
  );
};

export default DistrictCardEvaluation;
