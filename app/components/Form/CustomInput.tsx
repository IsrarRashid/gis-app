import React, { forwardRef, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const CustomInput = forwardRef<HTMLInputElement, Props>(
  ({ className, style, ...rest }, ref) => {
    return (
      <input
        {...rest}
        ref={ref}
        className={`form-control form-control-sm color-light-dark shadow-none ${
          className || ""
        }`}
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          ...style,
        }}
      />
    );
  }
);

// 💡 Add this line to resolve the lint error
CustomInput.displayName = "CustomInput";

export default CustomInput;
