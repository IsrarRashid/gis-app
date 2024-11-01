"use client";
import Image from "next/image";
import Button from "@/app/components/Button";

const PriorityMenu = () => {
  return (
    <>
      <Button
        type="button"
        className="nav-link btn btn-sm badge rounded-pill shadow-sm fs-6 bg-white mb-1 mt-1 "
        style={{
          padding: "10px 20px 10px 20px",
        }}
        data-bs-toggle="modal"
        data-bs-target="#priorityMenu"
      >
        <div className="row">
          <div className="col p-0 ps-2">
            <img
              src="/images/priority.png"
              alt="priority"
              className="img-fluid"
              style={{ width: "20px", height: "20px" }}
            />
          </div>
          <div className="col p-0 pe-2 " style={{ marginTop: "2px" }}>
            &nbsp;<span>Priority</span>
          </div>
        </div>
      </Button>

      <div
        className="modal fade"
        id="priorityMenu"
        aria-labelledby="priorityMenuLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md" style={{ marginTop: "80px" }}>
          <div
            className="modal-content border-0"
            style={{ background: "rgba(255,255,255,0)" }}
          >
            <div className="modal-body p-0">
              <div
                className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
                style={{
                  borderRadius: "20px",
                  background: "#fff",
                }}
              >
                <h3 className="fw-bold text-center">Priority Menu</h3>
                <div className="row d-flex">
                  <div className="col-lg-6 col-md-6 col-sm-12 text-end">
                    <Button
                      className="btn w-75 fs-5 text-white"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #0C8CE9 , #13629B)",
                        border: "0px",
                      }}
                    >
                      CM Priority
                    </Button>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                    <Button
                      className="btn w-75 fs-5 text-white"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #0C8CE9 , #13629B)",
                        border: "0px",
                      }}
                    >
                      ADP
                    </Button>
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

export default PriorityMenu;
