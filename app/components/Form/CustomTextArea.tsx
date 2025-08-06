import { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const CustomTextArea = ({ className, style, ...rest }: Props) => {
  return (
    <textarea
      {...rest}
      className="form-control form-control-sm color-light-dark shadow-none"
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        height: "100px",
        ...style,
      }}
    />
  );
};

export default CustomTextArea;
