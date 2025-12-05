import { PropsWithChildren, ReactNode } from "react";

interface Props {
  children: ReactNode;
  background?: "#EEF2FF" | "#FFEEEE" | "#eeffef"; // blue, red, green
  color?: "#1c6ba6" | "#A61C1C" | "#198754" | "#0C8CE9"; // blue, red, green
}

const Badge = ({
  children,
  background = "#EEF2FF",
  color = "#1c6ba6",
}: Props) => {
  return (
    <span
      className="badge rounded-pill fw-6 fs15px text-nowrap"
      style={{
        background: background,
        color: color,
        padding: "5px 8px",
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
