const ObservationsAndRecommendations = () => {
  return (
    <div
      className="col p-0"
      style={{
        height: "541px",
        overflow: "hidden",
        overflowY: "scroll",
      }}
    >
      <div className="row d-flex flex-column mb-3">
        <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
          Incorrect name on ATM Card
        </p>
        <ol className="m-0 pe-0 fw-bold">
          <li className="mb-3">
            The observation indicates that the ATM card featured has an
            incorrect name, which suggests a potential issue with customer
            identification and financial transactions. This could lead to
            complications for users when attempting to access their accounts or
            perform transactions.
          </li>
          <li className="mb-3">
            The observation indicates that the ATM card featured has an
            incorrect name, which suggests a potential issue with customer
            identification and financial transactions. This could lead to
            complications for users when attempting to access their accounts or
            perform transactions.
          </li>
          <li className="mb-3">
            The observation indicates that the ATM card featured has an
            incorrect name, which suggests a potential issue with customer
            identification and financial transactions. This could lead to
            complications for users when attempting to access their accounts or
            perform transactions.
          </li>
          <li className="mb-3">
            The observation indicates that the ATM card featured has an
            incorrect name, which suggests a potential issue with customer
            identification and financial transactions. This could lead to
            complications for users when attempting to access their accounts or
            perform transactions.
          </li>
        </ol>
      </div>
      <div
        className="row d-flex flex-column mb-2 m-0"
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

export default ObservationsAndRecommendations;
