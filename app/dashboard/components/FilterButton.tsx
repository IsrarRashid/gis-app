import { Dispatch, SetStateAction, useState } from "react";
import { Lexend } from "next/font/google";
import Button from "@/app/components/Button";
import FilterMenu from "./FilterMenu";
import { FilterData } from "./Dashboard";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "400",
});

interface Props {
  handleSubmit: (filterData: FilterData[]) => Promise<void>;
  handleDistrictClick: (filterData: FilterData[]) => Promise<void>;
  filterFixedOption: FilterData;
  setFilterFixedOption: Dispatch<SetStateAction<FilterData>>;
}

const FilterButton = ({
  handleDistrictClick,
  handleSubmit,
  filterFixedOption,
  setFilterFixedOption,
}: Props) => {
  const [selectedButton, setSelectedButton] = useState(1);

  return (
    <div
      className={`col mb-2 shadow-sm fs14px ${lexend.className}`}
      style={{
        background: "#C6D9F1",
        borderRadius: "10px",
        padding: "20px ",
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
            className={`btn rounded-pill border-0 shadow-none fw-normal w-100 whiteSpaceNoWrap ${
              selectedButton === 1 ? "text-white" : ""
            }`}
            style={{
              paddingTop: "12px",
              paddingBottom: "12px",
              background: `${
                selectedButton === 1 ? "radial-gradient(#0C8CE9, #13629B)" : ""
              }`,
            }}
            onClick={() => {
              setSelectedButton(1);
              setFilterFixedOption({
                filterIdentifier: "switch",
                filterValues: "CMInitiative",
              });
              handleSubmit([
                {
                  filterIdentifier: "switch",
                  filterValues: "CMInitiative",
                },
              ]);
            }}
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
            onClick={() => {
              setSelectedButton(2);
              setFilterFixedOption({
                filterIdentifier: "",
                filterValues: "",
              });
              handleSubmit([
                {
                  filterIdentifier: "",
                  filterValues: "",
                },
              ]);
            }}
          >
            ADP
          </Button>
        </div>
        <div className="p-0 col-2 text-center m-auto">
          <FilterMenu
            handleSubmit={handleSubmit}
            handleDistrictClick={handleDistrictClick}
            filterFixedOption={filterFixedOption}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterButton;
