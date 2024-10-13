"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  type?: "button" | "submit" | "reset";
  style?: {};
  className: string;
  onClick?: () => void;
  children?: ReactNode;
  id?: string;
  role?: string;
  disabled?: boolean;
  "data-bs-toggle"?: string;
  "data-bs-target"?: string;
  "data-bs-dismiss"?: string;
  "aria-label"?: string;
  "data-bs-placement"?: string;
  title?: string;
}

const Button = ({
  type,
  style,
  className,
  onClick = () => {},
  children,
  id,
  role,
  disabled,
  "data-bs-toggle": dataBsToggle,
  "data-bs-target": dataBsTarget,
  "data-bs-dismiss": dataBsDismiss,
  "aria-label": ariaLabel,
  "data-bs-placement": dataBsPlacement,
  title,
}: Props) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      type={type}
      style={style}
      className={className}
      onClick={onClick}
      id={id}
      role={role}
      disabled={disabled}
      data-bs-toggle={dataBsToggle}
      data-bs-target={dataBsTarget}
      data-bs-dismiss={dataBsDismiss}
      aria-label={ariaLabel}
      data-bs-placement={dataBsPlacement}
      title={title}
    >
      {children}
    </motion.button>
  );
};

export default Button;
