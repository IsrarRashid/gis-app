import { LabelHTMLAttributes, ReactNode } from "react";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

const CustomLabel = ({ children, ...rest }: Props) => {
  return (
    <label
      {...rest}
      className="form-label form-label-color-black fw-5 fs14px"
      style={{ marginBottom: "6px" }}
    >
      {children}
    </label>
  );
};

// 💡 Add this line to resolve the lint error
CustomLabel.displayName = "CustomLabel";

export default CustomLabel;
