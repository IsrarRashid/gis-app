const FinancialAnalysis = () => {
  return (
    <div className="col p-0">
      <div className="row d-flex mb-3">
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Fiscal year
          </p>
          <p className="m-0 pe-0 fw-bold">2024-2025</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Allocation (M)
          </p>
          <p className="m-0 pe-0 fw-bold">2000</p>
        </div>
      </div>
      <div className="row d-flex mb-3">
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Releases
          </p>
          <p className="m-0 pe-0 fw-bold">2000</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Utilization (M)
          </p>
          <p className="m-0 pe-0 fw-bold">422.535</p>
        </div>
      </div>
      <div className="row d-flex mb-3">
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Release/Allocation (%)
          </p>
          <p className="m-0 pe-0 fw-bold">90</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Utilization/Releases (%)
          </p>
          <p className="m-0 pe-0 fw-bold">50</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysis;
