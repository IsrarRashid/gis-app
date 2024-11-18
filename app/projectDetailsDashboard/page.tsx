import Image from "next/image";
import Button from "../components/Button";
import arrowLeft from "@/public/icons/arrow-left.svg";
import arrowRight from "@/public/icons/arrow-right.svg";

const ProjectDetailsPage = () => {
  return (
    <>
      {/* <Button
        type="button"
        className="col shadow-none btn p-0"
        data-bs-toggle="modal"
        data-bs-target="#reportsModal"
      >
        <img
          src="/icons/linkArrowBlack.svg"
          className="img-fluid"
          style={{ width: "15px", height: "15px" }}
          alt="linkArrowBlack"
        />
      </Button>
      <div
        className="modal fade"
        id="reportsModal"
        aria-labelledby="reportsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" style={{ marginTop: "80px" }}>
          <div
            className="modal-content border-0"
            style={{ background: "rgba(255,255,255,0)" }}
          >
            <div className="modal-body p-0">
              <div
                className="container-fluid border border-white pt-3 pb-3 ps-0 pe-0"
                style={{
                  borderRadius: "20px",
                  background: "#E8E8E8",
                }}
              >
                <div className="col bg-color-sea-blue text-center py-3 fw-bold text-white fs14px letterSpacing1px">
                  Observations
                </div>
                <div className="col p-3">
                  <p className="m-0 fw-bold">
                    Observation 1 (Poor Workmanship)
                  </p>
                  <p className="col">
                    Based on the provided context and described elements of the
                    image, here are brief observations and recommendations:
                    Observations: - Dismantled Material: The image likely
                    depicts various materials that have been dismantled and are
                    prepared for the creation of an embankment. This suggests
                    it&apos;s part of a construction or landscaping process.
                    Natural Elements: The mention of plants, trees, and grass
                    indicates that the site is perhaps being integrated with
                    natural landscaping or that environmental considerations are
                    present.
                  </p>
                  <img
                    className="img-fluid"
                    src="/images/observationImage.png"
                    alt="observationImage"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="row d-flex justify-content-start ps-3 pe-3">
                  <div className="col">
                    <label htmlFor="rowPerPage" className="form-label mt-2">
                      Observations:&nbsp;
                    </label>
                    <select
                      className="rounded bg-color-sea-green text-white shadow p-2"
                      style={{
                        color: "#fff",
                        border: "1px solid #445E84",
                        outline: "none",
                      }}
                      aria-label="Rows per page"
                      name="rowPerPage"
                    >
                      {[10, 20, 30, 40, 50].map((num) => (
                        <option key={num} value={num}>
                          &nbsp;{num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col">
                    <Button
                      className="btn bg-color-sea-green shadow me-2"
                      style={{
                        border: "1px solid #445E84",
                      }}
                    >
                      <Image src={arrowLeft} alt="arrow left" />
                    </Button>
                    <Button
                      className="btn bg-color-sea-green shadow"
                      style={{
                        border: "1px solid #445E84",
                      }}
                    >
                      <Image src={arrowRight} alt="arrow right" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default ProjectDetailsPage;
