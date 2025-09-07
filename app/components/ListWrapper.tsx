import { PropsWithChildren } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ListWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={`container-fluid bg-white ${plusJakartaSans.className}`}
      style={{
        border: "1.08px solid #CBD5E1",
        borderRadius: "15px",
      }}
    >
      {children}
    </div>
  );
};

export default ListWrapper;
