import Image from "next/image";
import { Lexend } from "next/font/google";
import dollarSignCircle from "@/public/icons/dollarSignCircle.svg";
import dash from "@/public/icons/dash.svg";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "400",
});

const FinancialTab = () => {
  return (
    <div
      className={`col mb-3 shadow-sm fs14px ${lexend.className}`}
      style={{
        background: "#C6D9F1",
        borderRadius: "10px",
        padding: "20px 35px 15px 35px ",
        color: "#334155",
      }}
    >
      <p className="col fw-bold mb-2">Financial</p>
      <div
        className="row d-flex flex-wrap mb-2 whiteSpaceNoWrap"
        style={{ background: "rgba(235, 239, 253, 0.33)", borderRadius: "6px" }}
      >
        <div
          className="p-0 col"
          style={{ background: "#EBEFFD", borderRadius: "6px" }}
          role="group"
        >
          <div
            className="row d-flex flex-wrap justify-content-center m-0"
            style={{ padding: "13px 5px 13px 0px " }}
          >
            <div className="col p-0 text-center">
              <Image
                src={dollarSignCircle}
                alt="dollarSignCircle"
                width={20}
                height={20}
              />
            </div>
            <div className="col p-0">Min:</div>
            <div className="col p-0">0 M</div>
            <div className="col p-0">
              <Image
                src={dash}
                alt="dash"
                className="ms-2"
                width={9}
                height={9}
              />
            </div>
            <div className="col p-0">Max:</div>
            <div className="col p-0">200 M</div>
          </div>
        </div>
        <div className="p-0 col-2 text-center m-auto">200</div>
      </div>
      <div
        className="row d-flex flex-wrap whiteSpaceNoWrap"
        style={{ background: "rgba(235, 239, 253, 0.33)", borderRadius: "6px" }}
      >
        <div
          className="p-0 col"
          style={{ background: "#EBEFFD", borderRadius: "6px" }}
          role="group"
        >
          <div
            className="row d-flex flex-wrap justify-content-center m-0"
            style={{ padding: "13px 5px 13px 0px " }}
          >
            <div className="col p-0 text-center">
              <Image
                src={dollarSignCircle}
                alt="dollarSignCircle"
                width={20}
                height={20}
              />
            </div>
            <div className="col p-0">Min:</div>
            <div className="col p-0">200 M</div>
            <div className="col p-0">
              <Image
                src={dash}
                alt="dash"
                className="ms-2"
                width={9}
                height={9}
              />
            </div>
            <div className="col p-0">Max:</div>
            <div className="col p-0">400 M</div>
          </div>
        </div>
        <div className="p-0 col-2 text-center m-auto">127</div>
      </div>
    </div>
  );
};

export default FinancialTab;
