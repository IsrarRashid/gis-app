import { Dispatch, SetStateAction, useState } from "react";
import { Lexend } from "next/font/google";
import Button from "@/app/components/Button";
import { FilterData } from "./Dashboard";
import FilterModal from "./FilterModal";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "400",
});

interface Props {
  handleSubmit: (filterData: FilterData[]) => Promise<void>;
  otherFilters: FilterData[];
  setOtherFilters: Dispatch<SetStateAction<FilterData[]>>;
  handleFilterChange: (filterType: "cmInitiative" | "adp") => void;
  combinedFilters: FilterData[];
  cmInitiativeFilters: FilterData[];
  adpFilters: FilterData[];
  activeFilter: string;
}

const FilterButtons = ({
  handleSubmit,
  otherFilters,
  setOtherFilters,
  handleFilterChange,
  combinedFilters,
  cmInitiativeFilters,
  adpFilters,
  activeFilter,
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
              handleFilterChange("cmInitiative");
              handleSubmit([...cmInitiativeFilters, ...otherFilters]);
            }}
          >
            CM Initiatives
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
              handleFilterChange("adp");
              handleSubmit([...adpFilters, ...otherFilters]);
            }}
          >
            ADP
          </Button>
        </div>
        <div className="p-0 col-2 text-center m-auto">
          <FilterModal
            otherFilters={otherFilters}
            setOtherFilters={setOtherFilters}
            handleSubmit={handleSubmit}
            combinedFilters={combinedFilters}
            activeFilter={activeFilter}
            cmInitiativeFilters={cmInitiativeFilters}
            adpFilters={adpFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterButtons;
