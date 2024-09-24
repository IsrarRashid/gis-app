import Image from "next/image";
import road from "../../../public/icons/road.svg";
import redCircle from "../../../public/icons/redCircle.svg";

const Visits = () => {
  return (
    <div
      className="col p-1 shadow-sm pb-5"
      style={{ background: "#C6D9F1", borderRadius: "15px" }}
    >
      <div className="row m-0">
        <div className="col text-end p-0">
          <Image src={redCircle} alt="redCircle" />
        </div>
      </div>
      <div className="row d-flex ps-3 pb-2">
        <div className="col-2 p-0">
          <Image src={road} alt="road" />
        </div>
        <div className="col">
          <div className="row d-flex">
            <div className="col-8">
              <p
                className="text-secondary m-0 pt-1"
                style={{ fontSize: ".9rem" }}
              >
                Visits of ring road Project{" "}
              </p>
            </div>
            <div className="col pt-2">
              <p
                className="m-0"
                style={{ fontSize: ".6rem", color: "#E9E9E9" }}
              >
                Am
              </p>
              <p className="m-0 text-white" style={{ fontSize: ".8rem" }}>
                09:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visits;
