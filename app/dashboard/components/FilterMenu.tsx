"use client";
import Image from "next/image";
import filterBlack from "../../../public/icons/filterBlack.svg";
import Button from "@/app/components/Button";

const FilterMenu = () => {
  return (
    <>
      <Button
        type="button"
        className="btn rounded-pill"
        data-bs-toggle="modal"
        data-bs-target="#filterMenu"
      >
        <Image src={filterBlack} alt="filterBlack" width={18} height={18} />
      </Button>

      <div
        className="modal fade"
        id="filterMenu"
        aria-labelledby="filterMenuLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" style={{ marginTop: "80px" }}>
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
                <h3 className="fw-bold text-center">Filter Menu</h3>
                <div className="row d-flex justify-content-center mb-3">
                  <div className="col-lg-5 col-md-6 col-sm-12 text-start">
                    <label htmlFor="status" className="form-label">
                      Year
                    </label>
                    <select
                      className="form-select form-select-sm"
                      aria-label="Default select example"
                      name="status"
                      //   onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Scheduled">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="col-lg-5 col-md-6 col-sm-12 text-start">
                    <label htmlFor="sectorId" className="form-label">
                      Department
                    </label>
                    <select
                      className="form-select form-select-sm"
                      name="sectorId"
                      //   onChange={}
                      //   value={}
                    >
                      <option value={0}>None</option>
                      <option value={1}>asd</option>
                    </select>
                  </div>
                </div>
                <div className="row d-flex justify-content-center mb-3">
                  <div className="col-lg-5 col-md-6 col-sm-12 text-start">
                    <label htmlFor="status" className="form-label">
                      Division
                    </label>
                    <select
                      className="form-select form-select-sm"
                      aria-label="Default select example"
                      name="status"
                      //   onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Scheduled">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="col-lg-5 col-md-6 col-sm-12 text-start">
                    <label htmlFor="sectorId" className="form-label">
                      District
                    </label>
                    <select
                      className="form-select form-select-sm"
                      name="sectorId"
                      //   onChange={}
                      //   value={}
                    >
                      <option value={0}>None</option>
                      <option value={1}>asd</option>
                    </select>
                  </div>
                </div>
                <div className="row d-flex justify-content-center mb-3">
                  <div className="col-lg-5 col-md-6 col-sm-12 text-start">
                    <label htmlFor="status" className="form-label">
                      Scheme
                    </label>
                    <select
                      className="form-select form-select-sm"
                      aria-label="Default select example"
                      name="status"
                      //   onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Scheduled">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="col-lg-5 col-md-6 col-sm-12 text-start">
                    <label htmlFor="sectorId" className="form-label">
                      Sector
                    </label>
                    <select
                      className="form-select form-select-sm"
                      name="sectorId"
                      //   onChange={}
                      //   value={}
                    >
                      <option value={0}>None</option>
                      <option value={1}>asd</option>
                    </select>
                  </div>
                </div>
                <div className="row d-flex justify-content-center mb-3">
                  <div className="col-lg-5 col-md-6 col-sm-12 text-start">
                    <label htmlFor="status" className="form-label">
                      Region
                    </label>
                    <select
                      className="form-select form-select-sm"
                      aria-label="Default select example"
                      name="status"
                      //   onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Scheduled">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="col-lg-5 col-md-6 col-sm-12 text-start">
                    <label htmlFor="sectorId" className="form-label">
                      SubType Package
                    </label>
                    <select
                      className="form-select form-select-sm"
                      name="sectorId"
                      //   onChange={}
                      //   value={}
                    >
                      <option value={0}>None</option>
                      <option value={1}>asd</option>
                    </select>
                  </div>
                </div>
                <div className="row d-flex justify-content-center mb-3">
                  <div className="col-lg-5 col-md-6 col-sm-12 text-start">
                    <label htmlFor="status" className="form-label">
                      Project Cast Type
                    </label>
                    <select
                      className="form-select form-select-sm"
                      aria-label="Default select example"
                      name="status"
                      //   onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Scheduled">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="col-lg-5 col-md-6 col-sm-12 text-start">
                    <label htmlFor="sectorId" className="form-label">
                      Approval Status
                    </label>
                    <select
                      className="form-select form-select-sm"
                      name="sectorId"
                      //   onChange={}
                      //   value={}
                    >
                      <option value={0}>None</option>
                      <option value={1}>asd</option>
                    </select>
                  </div>
                </div>
                <div className="row d-flex">
                  <div className="col-lg-6 col-md-6 col-sm-12 text-end">
                    <Button
                      className="btn w-50 fs-5 text-white"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #0C8CE9 , #13629B)",
                        border: "0px",
                      }}
                    >
                      Filter
                    </Button>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                    <Button
                      className="btn w-50 fs-5"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      style={{
                        border: "2px solid #0C8CE9",
                        color: "#0C8CE9",
                      }}
                    >
                      Reset
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

export default FilterMenu;
