import Image from "next/image";
import { useState } from "react";
import filterBlack from "@/public/icons/filterBlack.svg";
import { Lexend } from "next/font/google";
import Button from "@/app/components/Button";
import FilterMenu from "./FilterMenu";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "400",
});

const FilterButton = () => {
  const [selectedButton, setSelectedButton] = useState(1);

  return (
    <div
      className={`col mb-3 shadow-sm fs14px ${lexend.className}`}
      style={{
        background: "#C6D9F1",
        borderRadius: "10px",
        padding: "20px 35px 15px 35px ",
      }}
    >
      <div
        className="row d-flex flex-wrap rounded-pill "
        style={{ background: "rgba(235, 239, 253, 0.33)" }}
      >
        <div
          className="p-0 col btn-group rounded-pill"
          style={{ background: "#EBEFFD" }}
          role="group"
        >
          <Button
            type="button"
            className={`btn rounded-pill border-0 shadow-none fw-normal w-100 ${
              selectedButton === 1 ? "text-white" : ""
            }`}
            style={{
              paddingTop: "12px",
              paddingBottom: "12px",
              background: `${
                selectedButton === 1 ? "radial-gradient(#0C8CE9, #13629B)" : ""
              }`,
            }}
            onClick={() => setSelectedButton(1)}
          >
            CM Initiative
          </Button>
          <Button
            type="button"
            className={`btn rounded-pill border-0 shadow-none fw-normal w-100 ${
              selectedButton === 2 ? "text-white" : ""
            }`}
            style={{
              paddingTop: "12px",
              paddingBottom: "12px",
              background: `${
                selectedButton === 2 ? "radial-gradient(#0C8CE9, #13629B)" : ""
              }`,
            }}
            onClick={() => setSelectedButton(2)}
          >
            ADP
          </Button>
        </div>
        <div className="p-0 col-2 text-center m-auto">
          <FilterMenu />
        </div>
      </div>
    </div>
  );
};

export default FilterButton;
