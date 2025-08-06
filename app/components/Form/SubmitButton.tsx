import { PropsWithChildren } from "react";
import Button from "../Button";

const SubmitButton = ({ children }: PropsWithChildren) => {
  return (
    <Button
      className="btn text-white w-100 border-0 fw-bold fs14px"
      style={{
        backgroundImage: "linear-gradient(to bottom, #0C8CE9 ,#074F83)",
        borderRadius: "10px",
        padding: "11px 16px",
      }}
      type="submit"
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
