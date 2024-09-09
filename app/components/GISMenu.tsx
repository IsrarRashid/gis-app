"use client";
import downArrow from "../../public/icons/down-arrow.svg";
import Image from "next/image";
import cross from "../../public/icons/cross-2.svg";
import clock2 from "../../public/icons/clock-2.svg";
import db from "../../public/icons/db.svg";
import qr from "../../public/icons/qr.svg";
import location from "../../public/icons/location.svg";
import { useDispatch } from "react-redux";
import { setContent } from "../features/content/contentSlice";
import { useRouter } from "next/navigation";

const GISMenu = () => {
  const dispatch = useDispatch();

  const handleButtonClick = (content: string) => {
    dispatch(setContent(content));
  };

  const router = useRouter();

  return (
    <>
      <button
        type="button"
        className="nav-link btn btn-sm text-white badge rounded-pill bg-color-light-blue ps-3 pe-3 pt-2 pb-2 shadow-sm"
        data-bs-toggle="modal"
        data-bs-target="#gisMenuModal"
      >
        GIS Base Monitering &nbsp;
        <Image src={downArrow} alt="down arrow" />
      </button>

      <div
        className="modal fade"
        id="gisMenuModal"
        aria-labelledby="gisMenuModalLabel"
        aria-hidden="true"
        data-bs-backdrop="false"
      >
        <div className="modal-dialog modal-xl" style={{ marginTop: "80px" }}>
          <div
            className="modal-content border-0"
            style={{ background: "rgba(255,255,255,0)" }}
          >
            <div className="modal-body p-0">
              <div
                className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4 bg-blur"
                style={{
                  borderRadius: "20px",
                }}
              >
                <div className="col mb-4">
                  <button
                    className="btn p-0"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <Image src={cross} alt="cross" width={30} />
                  </button>
                </div>
                <div className="row d-flex justify-content-center p-4">
                  <div className="col text-center">
                    <button
                      className="btn p-0"
                      onClick={() => router.push("/sectors")}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <div
                        className="col text-center"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom right, #7b9cc9 , #b4cdf0)",
                          borderRadius: "10px",
                          padding: "40px 45px",
                        }}
                      >
                        <Image src={clock2} alt="clock2" width={40} />
                      </div>
                      <div className="col text-center fw-bold mt-1">Sector</div>
                    </button>
                  </div>
                  <div className="col text-center">
                    <button
                      className="btn p-0"
                      onClick={() => router.push("/projects")}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <div
                        className="col text-center"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom right, #8B5ABF , #5345DF)",
                          borderRadius: "10px",
                          padding: "40px 45px",
                        }}
                      >
                        <Image src={qr} alt="qr" width={40} />
                      </div>
                      <div className="col text-center fw-bold mt-1">
                        Projects
                      </div>
                    </button>
                  </div>
                  <div className="col text-center">
                    <button
                      className="btn p-0"
                      onClick={() => router.push("/attributeGroups")}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <div
                        className="col text-center"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom right, #22B46A , #096764)",
                          borderRadius: "10px",
                          padding: "40px 45px",
                        }}
                      >
                        <Image src={location} alt="location" width={40} />
                      </div>
                      <div className="col text-center fw-bold mt-1">
                        Attribute Groups
                      </div>
                    </button>
                  </div>
                  <div className="col text-center">
                    <button
                      className="btn p-0"
                      onClick={() => router.push("/attributes")}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <div
                        className="col text-center"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom right, #F08630 , #E75161)",
                          borderRadius: "10px",
                          padding: "40px 45px",
                        }}
                      >
                        <Image src={db} alt="db" width={40} />
                      </div>
                      <div className="col text-center fw-bold mt-1">
                        Attributes
                      </div>
                    </button>
                  </div>
                  <div className="col text-center">
                    <button
                      className="btn p-0"
                      onClick={() => router.push("/user")}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <div
                        className="col text-center"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom right, #E8A070 , #DA4A6A)",
                          borderRadius: "10px",
                          padding: "43px 45px",
                        }}
                      >
                        <Image src={clock2} alt="clock2" width={40} />
                      </div>
                      <div className="col text-center fw-bold mt-1">User</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GISMenu;
