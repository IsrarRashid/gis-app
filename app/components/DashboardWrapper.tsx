import { PropsWithChildren } from "react";

const DashboardWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="shadow"
      style={{
        padding: "2.77px",
        backgroundImage:
          "linear-gradient(to bottom right, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1))",
        borderRadius: "10px",
        border: "2.77px solid rgba(255, 255, 255, 0.6)",
      }}
    >
      <div
        className="container-fluid p-1"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
          borderRadius: "10px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardWrapper;
