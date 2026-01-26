import CustomModal from "../components/CustomModal/CustomModal";
import AssignProjectPartTwoBarChartTile from "./components/AssignProjectPartTwoBarChartTile";
import BarChartTile from "./components/BarChartTile";
import BarChartTileSNEWiseProjects from "./components/BarChartTileSNEWiseProjects";
import BarChartTileTotalProjects from "./components/BarChartTileTotalProjects";
import CompletedProjectsBarChartTile from "./components/CompletedProjectsBarChartTile";
import DistrictWiseProjectsBarChartTile from "./components/DistrictWiseProjectsBarChartTile";
import SectorWiseProgressPieChartTile from "./components/SectorWiseProgressPieChartTile";

export interface SeasonCycle {
  totalProduction: number;
  punjabProduction: number;
  sindhProduction: number;
  balochistanProduction: number;
  kpkProduction: number;
  punjabPercentage: number;
  sindhPercentage: number;
  balochistanPercentage: number;
  kpkPercentage: number;
  punjabSession: string;
  sindhSession: string;
  balochistanSession: string;
  kpkSession: string;
  countryCycles: {
    countryId: number;
    countryName: string;
    totalSupply: number; //production
    percentage: number;
    sessionName: string;
  }[];
}

const ChartsPage = () => {
  const tiles = [
    {
      label: "Total Projects",
      count: 1032,
    },
    {
      label: "Unassigned Projects",
      count: 17,
    },
    {
      label: "In Progress Projects",
      count: 165,
    },
    {
      label: "Completed Projects",
      count: 676,
    },
    {
      label: "Stopped Projects",
      count: 172,
    },
  ];

  // const seasonCycleData: SeasonCycle = {
  //   totalProduction: 43729351,
  //   punjabProduction: 38694922,
  //   sindhProduction: 2390730,
  //   balochistanProduction: 1635337,
  //   balochistanSession: "testing",
  //   kpkSession: "testing",
  //   punjabSession: "testing",
  //   sindhSession: "testing",
  //   kpkProduction: 1008362,
  //   punjabPercentage: 88.48729998302512,
  //   sindhPercentage: 5.4671060633852075,
  //   balochistanPercentage: 3.7396781854823318,
  //   kpkPercentage: 2.305915768107329,
  //   countryCycles: [
  //     {
  //       countryId: 4,
  //       countryName: "China",
  //       totalSupply: 52868,
  //       percentage: 0.12089820404606508,
  //       sessionName: "",
  //     },
  //     {
  //       countryId: 3,
  //       countryName: "Afghanistan",
  //       totalSupply: 559040,
  //       percentage: 1.2784090941573774,
  //       sessionName: "",
  //     },
  //     {
  //       countryId: 2,
  //       countryName: "Iran",
  //       totalSupply: 188351,
  //       percentage: 0.430719861358107,
  //       sessionName: "",
  //     },
  //   ],
  // };

  return (
    <div style={{ marginTop: "-8px" }}>
      <div
        className="row"
        style={{
          padding: "15px 30px",
          background: "#F8FAFC",
          gap: "23px",
        }}
      >
        {tiles?.map((tile, i) => (
          <div
            key={i}
            className="col bg-white"
            style={{
              padding: "24px 32px",
              borderRadius: "32px",
              boxShadow: "0px 0px 0px 1px #E2E8F0",
            }}
          >
            <p className="fs14px fw-5 text-center" style={{ color: "#606060" }}>
              {tile.label}
            </p>
            <p className="m-0 text-center fw-bold">{tile.count}</p>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 32px" }}>
        <div className="row">
          <div className="col-6">
            <CustomModal
              showCloseButton={false}
              dialogClassName="gismenu-modal"
              button={<BarChartTile />}
              body={<BarChartTile chartSize="large" />}
              modalId={"bar chart-1"}
            />
          </div>
          <div className="col-6">
            <CustomModal
              showCloseButton={false}
              dialogClassName="gismenu-modal"
              button={<BarChartTileTotalProjects />}
              body={<BarChartTileTotalProjects chartSize="large" />}
              modalId={"bar chart-2"}
            />
          </div>
          <div className="col-6">
            <CustomModal
              showCloseButton={false}
              dialogClassName="gismenu-modal"
              button={<AssignProjectPartTwoBarChartTile />}
              body={<AssignProjectPartTwoBarChartTile chartSize="large" />}
              modalId={"bar chart-3"}
            />
          </div>
          <div className="col-6">
            <CustomModal
              showCloseButton={false}
              dialogClassName="gismenu-modal"
              button={<CompletedProjectsBarChartTile />}
              body={<CompletedProjectsBarChartTile chartSize="large" />}
              modalId={"bar chart-3"}
            />
          </div>
          <div className="col-8">
            <CustomModal
              showCloseButton={false}
              dialogClassName="gismenu-modal"
              button={<BarChartTileSNEWiseProjects />}
              body={<BarChartTileSNEWiseProjects chartSize="large" />}
              modalId={"bar chart-3"}
            />
          </div>
          <div className="col-4">
            <CustomModal
              showCloseButton={false}
              dialogClassName="gismenu-modal"
              button={<SectorWiseProgressPieChartTile />}
              body={<SectorWiseProgressPieChartTile chartSize="large" />}
              modalId={"two-level pie chart"}
            />
          </div>
          <div className="col-12">
            <CustomModal
              showCloseButton={false}
              dialogClassName="gismenu-modal"
              button={<DistrictWiseProjectsBarChartTile />}
              body={<DistrictWiseProjectsBarChartTile chartSize="large" />}
              modalId={"bar chart-4"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsPage;
