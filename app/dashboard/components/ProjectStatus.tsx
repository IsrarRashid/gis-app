const ProjectStatus = () => {
  return (
    <div
      className="col mb-2 shadow-sm fs14px"
      style={{
        background: "#C6D9F1",
        borderRadius: "10px",
        padding: "15px 35px 5px 35px ",
        color: "#334155",
      }}
    >
      <p
        className="mb-2 fw-bold pb-1"
        style={{ borderBottom: "1px dashed #97ABBD" }}
      >
        Project Status
      </p>
      <div
        className="row d-flex flex-wrap rounded mb-2"
        style={{ background: "rgba(235, 239, 253, 0.33)" }}
      >
        <div className="col-2 p-0">
          <img
            src="/images/pieChart.png"
            style={{ width: "42px", height: "42px" }}
            alt="pieChart"
            className="img-fluid"
          />
        </div>
        <div className="col p-0">
          <div className="row d-flex">
            <div className="col">
              <p className="mt-2 m-0 fw-bold">Approved:</p>
            </div>
            <div className="col">
              <p
                className="mt-2 m-0 fw-bold text-end pe-3"
                style={{ color: "#019B2D" }}
              >
                1232
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="row d-flex rounded mb-2"
        style={{ background: "rgba(235, 239, 253, 0.33)" }}
      >
        <div className="col-2 p-0">
          <img
            src="/images/unApproved.png"
            style={{ width: "42px", height: "42px" }}
            alt="unApproved"
            className="img-fluid"
          />
        </div>
        <div className="col p-0">
          <div className="row d-flex">
            <div className="col">
              <p className="mt-2 m-0 fw-bold">Unapproved:</p>
            </div>
            <div className="col">
              <p
                className="mt-2 m-0 fw-bold text-end pe-3"
                style={{ color: "#9F3434" }}
              >
                1232
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="row d-flex rounded mb-2"
        style={{ background: "rgba(235, 239, 253, 0.33)" }}
      >
        <div className="col-2 p-0">
          <img
            src="/images/clock.png"
            alt="clock"
            style={{ width: "42px", height: "42px" }}
            className="img-fluid"
          />
        </div>
        <div className="col p-0">
          <div className="row d-flex">
            <div className="col">
              <p className="mt-2 m-0 fw-bold">Dropped:</p>
            </div>
            <div className="col">
              <p
                className="mt-2 m-0 fw-bold text-end pe-3"
                style={{ color: "#727272" }}
              >
                1232
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="row d-flex rounded mb-2"
        style={{ background: "rgba(235, 239, 253, 0.33)" }}
      >
        <div className="col-2 p-0">
          <img
            src="/images/umbrella.png"
            alt="umbrella"
            style={{ width: "42px", height: "42px" }}
            className="img-fluid"
          />
        </div>
        <div className="col p-0">
          <div className="row d-flex">
            <div className="col">
              <p className="mt-2 m-0 fw-bold">Umbrella Scheme:</p>
            </div>
            <div className="col">
              <p
                className="mt-2 m-0 fw-bold text-end pe-3"
                style={{ color: "#727272" }}
              >
                45
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;
