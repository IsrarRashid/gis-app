import { PropsWithChildren } from "react";

const ListWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="shadow"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(255, 255, 255, 0.6) , rgba(255, 255, 255, 0.1))",
        borderRadius: "15px",
        padding: "2.7px",
      }}
    >
      <div
        className="container-fluid p-1"
        style={{
          backgroundImage:
            "linear-gradient(to bottom left, rgba(239, 239, 239, 0.6) , rgba(255, 255, 255, 0.08))",
          borderRadius: "15px",
        }}
      >
        <div className="px-3 py-1">{children}</div>
      </div>
    </div>
  );
};

export default ListWrapper;
