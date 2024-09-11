import Image from "next/image";
import eyeBold from "../../../public/icons/eyeBold.svg";
import archery from "../../../public/icons/archery.svg";
import meter from "../../../public/icons/meter.svg";
import levelUp from "../../../public/icons/levelUp.svg";
import waveUp from "../../../public/icons/waveUp.svg";
import waveDown from "../../../public/icons/waveDown.svg";

const Menu = () => {
  return (
    <div className="row d-flex justify-content-center">
      <div
        className="me-2 mb-2"
        style={{
          width: "230px",
          borderRadius: "10px",
          backgroundImage:
            "linear-gradient(to bottom right, #40DDFF , #0B98C5)",
        }}
      >
        <div className="row d-flex m-0 ps-3 pt-2">
          <div className="col-lg-4 col-md-5 col mt-4">
            <Image src={eyeBold} alt="eyeBold" width={40} height={40} />
          </div>
          <div className="col-lg-6 col-md-7 col">
            <div className="row">
              <div className="col-lg-10 col-md-12 col-sm-12 ">
                <p className="fs-1 text-white fw-bold m-0 pt-2 ps-2">50</p>
              </div>
              <div className="col-lg-10 col-md-12 col-sm-12 ">
                <div className="row d-flex">
                  <div className="col-lg-7 col-md-6 col p-0">
                    <Image src={waveUp} alt="waveUp" width={40} height={20} />
                  </div>
                  <div className="col-lg-5 col-md-6 col p-0">
                    <p className="m-0 text-white" style={{ fontSize: ".8rem" }}>
                      +12.5%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <p style={{ fontSize: ".8rem", color: "#89DAF2" }}>
              New Identified Schemes
            </p>
          </div>
        </div>
      </div>
      <div
        className="me-2 mb-2"
        style={{
          width: "230px",
          outline: "1px solid #0C8CE9",
          borderRadius: "10px",
          background: "rgba(12, 140, 233,.5)",
          // backgroundImage:
          //   "linear-gradient(to bottom right, #0c8ce9 , #0B98C5)",
        }}
      >
        <div className="row d-flex m-0 ps-3 pt-2">
          <div className="col-lg-4 col-md-5 col mt-4">
            <Image src={archery} alt="archery" width={40} height={40} />
          </div>
          <div className="col-lg-6 col-md-7 col">
            <div className="row">
              <div className="col-lg-10 col-md-12 col-sm-12 ">
                <p className="fs-1 text-white fw-bold m-0 pt-2 ps-2">10%</p>
              </div>
              <div className="col-lg-10 col-md-12 col-sm-12 ">
                <div className="row d-flex">
                  <div className="col-lg-7 col-md-6 col p-0">
                    <Image
                      src={waveDown}
                      alt="waveDown"
                      width={40}
                      height={20}
                    />
                  </div>
                  <div className="col-lg-5 col-md-6 col p-0">
                    <p
                      className="m-0 text-danger"
                      style={{ fontSize: ".8rem" }}
                    >
                      -5.23%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col text-center text-white">
            <p style={{ fontSize: ".8rem" }}>Achieved Progress</p>
          </div>
        </div>
      </div>
      <div
        className="me-2 mb-2"
        style={{
          width: "230px",
          outline: "1px solid #0C8CE9",
          borderRadius: "10px",
          background: "rgba(12, 140, 233,.3)",
          // backgroundImage:
          //   "linear-gradient(to bottom right, #40DDFF , #0B98C5)",
        }}
      >
        <div className="row d-flex m-0 ps-3 pt-2">
          <div className="col-lg-4 col-md-5 col mt-4">
            <Image src={meter} alt="meter" width={40} height={40} />
          </div>
          <div className="col-lg-6 col-md-7 col">
            <div className="row">
              <div className="col-lg-10 col-md-12 col-sm-12 ">
                <p className="fs-1 text-white fw-bold m-0 pt-2 ps-2">02%</p>
              </div>
              <div className="col-lg-10 col-md-12 col-sm-12 ">
                <div className="row d-flex">
                  <div className="col-lg-7 col-md-6 col p-0">
                    <Image
                      src={waveDown}
                      alt="waveDown"
                      width={40}
                      height={20}
                    />
                  </div>
                  <div className="col-lg-5 col-md-6 col p-0">
                    <p
                      className="m-0 text-danger"
                      style={{ fontSize: ".8rem" }}
                    >
                      -7.23%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col text-center text-white">
            <p style={{ fontSize: ".8rem" }}>Planned Progress</p>
          </div>
        </div>
      </div>
      <div
        className="me-2 mb-2"
        style={{
          width: "230px",
          outline: "1px solid #0C8CE9",
          borderRadius: "10px",
          background: "rgba(12, 140, 233,.4)",
          // backgroundImage:
          //   "linear-gradient(to bottom right, #40DDFF , #0B98C5)",
        }}
      >
        <div className="row d-flex m-0 ps-3 pt-2">
          <div className="col-lg-4 col-md-5 col mt-4">
            <Image src={levelUp} alt="levelUp" width={40} height={40} />
          </div>
          <div className="col-lg-6 col-md-7 col">
            <div className="row">
              <div className="col-lg-10 col-md-12 col-sm-12 ">
                <p className="fs-1 text-white fw-bold m-0 pt-2 ps-2">78%</p>
              </div>
              <div className="col-lg-10 col-md-12 col-sm-12 ">
                <div className="row d-flex">
                  <div className="col-lg-7 col-md-6 col p-0">
                    <Image src={waveUp} alt="waveUp" width={40} height={20} />
                  </div>
                  <div className="col-lg-5 col-md-6 col p-0">
                    <p className="m-0 text-white" style={{ fontSize: ".8rem" }}>
                      +12.5%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col text-center text-white">
            <p style={{ fontSize: ".8rem" }}>Financial Progress</p>
          </div>
        </div>
      </div>
      {/* <Menu /> */}
    </div>
  );
};

export default Menu;
