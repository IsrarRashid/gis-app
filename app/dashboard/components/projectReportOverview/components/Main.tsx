const Main = () => {
  return (
    <div className="col p-0">
      <div className="row d-flex flex-column mb-2">
        <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
          Report Name
        </p>
        <p className="m-0 pe-0 fw-bold">
          CM Himmat Card Program for Persons with Disabilities (PWDs)
        </p>
      </div>
      <div className="row d-flex mb-2">
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Visit Date
          </p>
          <p className="m-0 pe-0 fw-bold">10-Nov-2024</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Report Date
          </p>
          <p className="m-0 pe-0 fw-bold">12-Nov-2024</p>
        </div>
      </div>
      <div
        className="row d-flex flex-column mb-2"
        style={{
          overflow: "hidden",
          overflowX: "scroll",
        }}
      >
        <p
          className="m-0 fs14px pe-0"
          style={{
            color: "#414651",
          }}
        >
          Report Pictures
        </p>
        <div
          className="d-flex justify-content-start m-0 pe-0 fw-bold p-1"
          style={{
            border: "1px solid #D5D7DA",
            borderRadius: "8px",
          }}
        >
          <img
            src="/icons/reportImage.svg"
            className="img-fluid rounded-3 me-2"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
            }}
            alt="reportImage"
          />
          <img
            src="/icons/reportImage.svg"
            className="img-fluid rounded-3 me-2"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
            }}
            alt="reportImage"
          />
          <img
            src="/icons/reportImage.svg"
            className="img-fluid rounded-3 me-2"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
            }}
            alt="reportImage"
          />
          <img
            src="/icons/reportImage.svg"
            className="img-fluid rounded-3 me-2"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
            }}
            alt="reportImage"
          />
          <img
            src="/icons/reportImage.svg"
            className="img-fluid rounded-3 me-2"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
            }}
            alt="reportImage"
          />
          <img
            src="/icons/reportImage.svg"
            className="img-fluid rounded-3 me-2"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
            }}
            alt="reportImage"
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
