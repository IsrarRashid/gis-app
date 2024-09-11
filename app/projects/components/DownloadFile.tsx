import Image from "next/image";
import Picture1 from "../../../public/images/projectPdfFile/Picture1.jpg";
import Picture2 from "../../../public/images/projectPdfFile/Picture2.png";
import Picture3 from "../../../public/images/projectPdfFile/Picture3.jpg";
import Picture4 from "../../../public/images/projectPdfFile/Picture4.jpg";
import Picture5 from "../../../public/images/projectPdfFile/Picture5.jpg";
import Picture6 from "../../../public/images/projectPdfFile/Picture6.jpg";
import Picture7 from "../../../public/images/projectPdfFile/Picture7.jpg";

const DownloadFile = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center pt-5" style={{ color: "#002060" }}>
              MONITORING REPORT
            </h2>
            <h3 className="text-center pt-5" style={{ color: "#002060" }}>
              Lahore Ring Road - Southern Loop (SL-3) Construction of Road from
              Raiwind Road up to Multan Road
            </h3>
            <h5 className="text-center pt-5 fw-bold">September 2023</h5>
            <div className="text-center">
              <Image
                src={Picture1}
                className="rounded"
                alt="..."
                style={{ width: "75%" }}
              />
            </div>
            <div className="text-center pt-5">
              <Image src={Picture2} className="rounded" alt="..." />
            </div>
            <h4 className="text-center pt-5" style={{ color: "#0070C0" }}>
              Directorate General (Monitoring & Evaluation) Planning and
              Development Board Government of the Punjab
            </h4>
            <h5 className="text-center pt-5 fw-bold">
              4th Floor, 65- Trade Centre Block, Ayub Chowk, Johar Town, Lahore
            </h5>
            <h5 className="text-center fw-bold">
              042-99233177-91, <a href="#">info@dgmepunjab.gov.pk</a>
            </h5>

            {/* <!--Table 01 Start--> */}

            <h4 className="fw-bold pt-5" style={{ color: "#0070C0" }}>
              1.Project Profile
            </h4>
            <h5 className="text-center pt-5 fw-bold">Table 1</h5>
            <table className="table table-bordered border-light">
              <thead className="table-primary"></thead>
              <tbody className="">
                <tr>
                  <th
                    scope="col"
                    className="text-light text-center"
                    colSpan={2}
                  >
                    Lahore Ring Road - Southern Loop (SL-3) Construction of Road
                    from Raiwind Road up to Multan Road
                  </th>
                </tr>
                <tr>
                  <th scope="col">Objectives</th>
                  <th scope="col" className="fw-normal table-primary">
                    This road section is part of the Lahore Ring Road southern
                    loop, which will facilitate the movement of traffic from
                    Raiwind Road up to SL-4.{" "}
                  </th>
                </tr>
                <tr>
                  <th scope="col">GS NO.</th>
                  <th scope="col" className="fw-normal table-info">
                    4898 (2022-23)
                  </th>
                </tr>
                <tr>
                  <th scope="col">Scheme No.</th>
                  <th scope="col" className="fw-normal table-primary">
                    01192354147
                  </th>
                </tr>
                <tr>
                  <th scope="col">Location</th>
                  <th scope="col" className="fw-normal table-info">
                    Lahore
                  </th>
                </tr>
                <tr>
                  <th scope="col">ADP Sector</th>
                  <th scope="col" className="fw-normal table-primary">
                    Infrastructure Development
                  </th>
                </tr>
                <tr>
                  <th scope="col">Sub-Sector</th>
                  <th scope="col" className="fw-normal table-info">
                    Roads
                  </th>
                </tr>
                <tr>
                  <th scope="col">Sponsoring Ministry/ Agency</th>
                  <th scope="col" className="fw-normal table-primary">
                    Communication & Works Department
                  </th>
                </tr>
                <tr>
                  <th scope="col">Execution Agency</th>
                  <th scope="col" className="fw-normal table-info">
                    Lahore Ring Road Authority
                  </th>
                </tr>
                <tr>
                  <th scope="col">PC-I Cost</th>
                  <th scope="col" className="fw-normal table-primary">
                    Rs. 17,785.850 M
                  </th>
                </tr>
                <tr>
                  <th scope="col">Administrative Approval</th>
                  <th scope="col" className="fw-normal table-info">
                    01-08-2023
                  </th>
                </tr>
                <tr>
                  <th scope="col">Expenditure</th>
                  <th scope="col" className="fw-normal table-primary">
                    Rs. 6,000.00 M
                  </th>
                </tr>
                <tr>
                  <th scope="col">Planned Start Date</th>
                  <th scope="col" className="fw-normal table-info">
                    01-08-2023
                  </th>
                </tr>
                <tr>
                  <th scope="col">Planned End Date</th>
                  <th scope="col" className="fw-normal table-primary">
                    01-02-2024
                  </th>
                </tr>
                <tr>
                  <th scope="col">Actual Start Date</th>
                  <th scope="col" className="fw-normal table-info">
                    21-08-2023
                  </th>
                </tr>
                <tr>
                  <th scope="col">Gestation Period</th>
                  <th scope="col" className="fw-normal table-primary">
                    06 Months
                  </th>
                </tr>
                <tr>
                  <th scope="col">Approving Authority</th>
                  <th scope="col" className="fw-normal table-info">
                    PDWP
                  </th>
                </tr>
                <tr>
                  <th scope="col">Contractor</th>
                  <th scope="col" className="fw-normal table-primary">
                    M/s Frontier Works Organization{" "}
                  </th>
                </tr>
                <tr>
                  <th scope="col">Design Engineer</th>
                  <th scope="col" className="fw-normal table-info">
                    M/s National Engineering Services Pakistan (NESPEK)
                  </th>
                </tr>
                <tr>
                  <th scope="col">Resident Supervision</th>
                  <th scope="col" className="fw-normal table-primary">
                    M/S National Engineering Services Pakistan (NESPAK)
                  </th>
                </tr>
              </tbody>
            </table>

            {/* <!--Table 01 End--> */}

            {/* <!--Table 02 Start--> */}

            <h4 className="fw-bold pt-5" style={{ color: "#0070C0" }}>
              2. Design & Scope
            </h4>
            <h5 className="text-center pt-5 fw-bold">Table 2</h5>
            <table className="table table-bordered border-light">
              <thead className="table-primary"></thead>
              <tbody className="">
                <tr>
                  <th scope="col" className="text-light text-center">
                    Description
                  </th>
                  <th scope="col" className="text-light text-center">
                    Quantity
                  </th>
                  <th scope="col" className="text-light text-center">
                    Description
                  </th>
                  <th scope="col" className="text-light text-center">
                    Quantity
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Design Speed
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    120 KPH
                  </th>
                  <th scope="col" className="table-primary text-center">
                    Metaled width
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    10.8 m
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Outer Shoulder
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    3.0 m
                  </th>
                  <th scope="col" className="table-info text-center">
                    Central Median
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    0.6 m
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Inner Shoulder
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    3.0 m
                  </th>
                  <th scope="col" className="table-primary text-center">
                    Bridges (Main Carriageway)
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    06 No’s
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Asphalt Base Course
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    15 cm
                  </th>
                  <th scope="col" className="table-info text-center">
                    Bridges (Service Road)
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    03 No’s
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Asphalt Wearing Course
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    5 cm
                  </th>
                  <th scope="col" className="table-primary text-center">
                    Electric Duct
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    06 No’s
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Water Bound Macadam
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    25 cm
                  </th>
                  <th scope="col" className="table-info text-center">
                    Pipe Culverts
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    14No’s
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Subbase Course
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    20 cm
                  </th>
                  <th scope="col" className="table-primary text-center">
                    Underpasses
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    04 No’s
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Side Drain
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    16 Km
                  </th>
                  <th scope="col" className="table-info text-center"></th>
                  <th
                    scope="col"
                    className="fw-normal table-info text-center"
                  ></th>
                </tr>
              </tbody>
            </table>

            {/* <!--Table 02 End--> */}

            {/* <!--Table 03 Start--> */}

            <h4 className="fw-bold pt-5" style={{ color: "#0070C0" }}>
              3. Major Deliverables{" "}
            </h4>
            <h5 className="text-center pt-5 fw-bold">Table 3</h5>
            <table className="table table-bordered border-light">
              <thead className="table-primary"></thead>
              <tbody className="">
                <tr>
                  <th scope="col" className="text-light text-center">
                    PC-I Components
                  </th>
                  <th scope="col" className="text-light text-center">
                    Qty. (Km)
                  </th>
                  <th scope="col" className="text-light text-center">
                    Cost (Rs. M)
                  </th>
                  <th scope="col" className="text-light text-center">
                    Progress
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center align-middle">
                    Road work
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center align-middle"
                  >
                    8
                  </th>
                  <th
                    scope="col"
                    className="table-primary text-center align-middle"
                  >
                    11,402.814
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-danger"
                  >
                    <ul style={{ listStyleType: "none" }}>
                      <li>
                        Formation of Embankment <span>4.5%</span>
                      </li>
                      <li>
                        Laying of Subbase <span>1%</span>
                      </li>
                      <li>
                        Laying of WBM <span>0%</span>
                      </li>
                      <li>
                        Laying of Asphalt Basecourse <span>0%</span>
                      </li>
                      <li>
                        Laying of Asphalt wearing course <span>0%</span>
                      </li>
                      <li>
                        Material Stacking <span>7%</span>
                      </li>
                    </ul>
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center align-middle">
                    Road Structure
                  </th>
                  <th
                    scope="col"
                    className="fw-normal align-middle table-info text-center"
                  >
                    8
                  </th>
                  <th
                    scope="col"
                    className="table-info align-middle text-center"
                  >
                    2,915.341
                  </th>
                  <th scope="col" className="fw-normal table-info text-danger">
                    <ul style={{ listStyleType: "none" }}>
                      <li>
                        Bridges (6) <span>10%</span>
                      </li>
                      <li>
                        Culverts (14) <span>04%</span>
                      </li>
                      <li>
                        Underpasses (5) <span>02%</span>
                      </li>
                      <li>
                        Electric Ducts (6) <span>0%</span>
                      </li>
                    </ul>
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Ancillary Work
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    ---
                  </th>
                  <th scope="col" className="table-primary text-center">
                    369.556
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-danger"
                  >
                    Yet to Start.
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center align-middle">
                    General Items
                  </th>
                  <th
                    scope="col"
                    className="fw-normal align-middle table-info text-center"
                  >
                    ---
                  </th>
                  <th
                    scope="col"
                    className="table-info align-middle text-center"
                  >
                    19.800
                  </th>
                  <th scope="col" className="fw-normal table-info text-danger">
                    <ul style={{ listStyleType: "none" }}>
                      <li>
                        Soil Investigation <span>0%</span>
                      </li>
                      <li>
                        EIA Report <span>100%</span>
                      </li>
                      <li>
                        SNGPL NOC <span>0%</span>
                      </li>
                    </ul>
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Electric Work
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    ---
                  </th>
                  <th scope="col" className="table-primary text-center">
                    325.60
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-danger"
                  >
                    Yet to Start.
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Toll Plaza & Weigh Station
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    ---
                  </th>
                  <th scope="col" className="table-info text-center">
                    257.216
                  </th>
                  <th scope="col" className="fw-normal table-info text-danger">
                    {" "}
                    Yet to Start.
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Landscaping & Hort. Charges 1%
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    ---
                  </th>
                  <th scope="col" className="table-primary text-center">
                    152.903
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-danger"
                  >
                    Yet to Start.
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    3% Contingency
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    ---
                  </th>
                  <th scope="col" className="table-info text-center">
                    458.709
                  </th>
                  <th scope="col" className="fw-normal table-info">
                    {" "}
                    Ongoing
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    1% Consultancy Charges
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    ---
                  </th>
                  <th scope="col" className="table-primary text-center">
                    152.903
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-danger"
                  >
                    NESPAK Consultant
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Consultant Supervision 2%
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    ---
                  </th>
                  <th scope="col" className="table-info text-center">
                    305.807
                  </th>
                  <th scope="col" className="fw-normal table-info">
                    {" "}
                    NESPAK Consultant
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    PST @16% of Consultancy
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    ---
                  </th>
                  <th scope="col" className="table-primary text-center">
                    73.394
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-danger"
                  >
                    ---
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    5% PST
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    ---
                  </th>
                  <th scope="col" className="table-info text-center">
                    764.516
                  </th>
                  <th scope="col" className="fw-normal table-info">
                    {" "}
                    Partially Paid
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    IT (P.S)
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    ---
                  </th>
                  <th scope="col" className="table-primary text-center">
                    600.00
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-danger"
                  >
                    {" "}
                    Yet to Start
                  </th>
                </tr>
              </tbody>
            </table>

            {/* <!--Table 03 End--> */}

            {/* <!--Table 04 Start--> */}
            <h4 className="fw-bold pt-5 pb-5" style={{ color: "#0070C0" }}>
              4. Ongoing Activities{" "}
            </h4>
            <table className="table table-bordered border-light">
              <tbody>
                <tr>
                  <th scope="col" className="text-light">
                    Component
                  </th>
                  <th scope="col" className="text-light text-center">
                    {" "}
                    Progress
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    A.
                  </th>
                  <th scope="col" className="table-info text-center">
                    Road Work
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-light">
                    Earth Filling, Compaction Embankment
                  </th>
                  <th scope="col" className="fw-normal table-primary">
                    <span>
                      Laying and compaction of embankment earthwork material is
                      in progress. Out of 3,801,008 m3, around 4.2%, i.e.,
                      1,60,000 m3 earthwork material has been laid.
                    </span>
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-light">
                    Stacking of Material
                  </th>
                  <th scope="col" className="fw-normal table-info">
                    Material Stacking is in progress for the construction of the
                    subbase course and base course.{" "}
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    B.
                  </th>
                  <th scope="col" className="text-center table-primary">
                    Road Structures
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-light">
                    Bridges
                  </th>
                  <th scope="col" className="fw-normal table-info">
                    <ul>
                      <li>
                        Bridge-01 (RD 58+885): 22 out of 32 concrete piles are
                        cast. Steel fabrication for the prestressed girders is
                        in progress. Wet Rotatory Boring for the pile is in
                        progress.
                      </li>
                      <li>Bridge-02 (RD 59+195): No Activity observed.</li>
                      <li>
                        Bridge-03 (RD 60+147): 19 out of 24 concrete piles are
                        completed. Steel fabrication for the pile cap is in
                        progress. Wet Rotatory Boring for the pile is in
                        progress.{" "}
                      </li>
                      <li>
                        Bridge-04 (RD 62+442): Wet Rotatory Boring was in
                        progress.
                      </li>
                      <li>
                        Bridge-05 (RD 63+362): 11 out of 32 concrete piles are
                        constructed. Steel fixing for the pile is in progress.
                        Wet Rotatory Boring for the pile is in progress.{" "}
                      </li>
                      <li>
                        Bridge-06 (RD 63+760): 28 out of 42 concrete piles are
                        cast. Steel fixing for the pile is in progress. Wet
                        Rotatory Boring for the pile is in progress.{" "}
                      </li>
                    </ul>
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-light">
                    Underpasses/Subways
                  </th>
                  <th scope="col" className="fw-normal table-primary">
                    <ul>
                      <li>
                        Excavation for the construction of the Underpass-1 (RD
                        57+308), Underpass-2 (RD 57+990), Underpass-3 (RD
                        60+710) is completed. Lean was laid for two underpasses{" "}
                      </li>
                    </ul>
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-light">
                    Culverts
                  </th>
                  <th scope="col" className="fw-normal table-info">
                    Excavation for the construction of the 09 Culverts was
                    completed.
                  </th>
                </tr>
              </tbody>
            </table>

            <table
              className="table table-bordered border-light"
              style={{ backgroundColor: "yellow" }}
            >
              <tbody>
                <tr>
                  <th>Progress Analysis</th>
                  <th>Planned progress 32%</th>
                  <th>Achieved progress. 11 %</th>
                  <th>Financial progress 16%</th>
                  <th>Lag in physical progress -21%</th>
                  <th>Lag in financial progress 5%</th>
                </tr>
              </tbody>
            </table>

            {/* <!--Table 04 End--> */}

            {/* <!--Table 05 Start--> */}

            <h4 className="fw-bold pt-5" style={{ color: "#0070C0" }}>
              5. Earned Value Analysis
            </h4>
            <h5 className="text-center pt-5 fw-bold">Table 5</h5>
            <table className="table table-bordered border-light">
              <tbody className="">
                <tr>
                  <th scope="col" colSpan={2} className="text-light">
                    Earned Value Analysis/Parameters
                  </th>
                  <th scope="col" className="text-light text-center">
                    {" "}
                    Remarks
                  </th>
                </tr>
                <tr>
                  <th scope="col">Project Cost (M)</th>
                  <th scope="col" className="fw-normal table-info text-center">
                    17,785.9
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    Approved Cost
                  </th>
                </tr>
                <tr>
                  <th scope="col">Percent Completed [Physical]</th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    9%
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    Current physical progress
                  </th>
                </tr>
                <tr>
                  <th scope="col">Planned Value or BCWS</th>
                  <th scope="col" className="fw-normal table-info text-center">
                    5,335.8
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    Budgeted Cost of Work Scheduled
                  </th>
                </tr>
                <tr>
                  <th scope="col">Earned Value or BCWP</th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    1.600.7
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    Budgeted Cost of Work Performed
                  </th>
                </tr>
                <tr>
                  <th scope="col">Actual cost of work performed (ACWP)</th>
                  <th scope="col" className="fw-normal table-info text-center">
                    2600.0
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    Current financial progress
                  </th>
                </tr>
                <tr>
                  <th scope="col">Scheduled Variance (SV)</th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    -3735.0
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    ---
                  </th>
                </tr>
                <tr>
                  <th scope="col">Cost Variance (CV)</th>
                  <th scope="col" className="fw-normal table-info text-center">
                    -999.3
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    ---
                  </th>
                </tr>
                <tr>
                  <th scope="col">Schedule Performance Index (SPI)</th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    0.3
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center text-danger"
                  >
                    Project progress is behind schedule as SPI is less than 1.
                  </th>
                </tr>
                <tr>
                  <th scope="col">Cost Performance Index (CPI)</th>
                  <th scope="col" className="fw-normal table-info text-center">
                    0.6
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-info text-center text-danger"
                  >
                    Over Budget if CPI&lt;1
                  </th>
                </tr>
                <tr>
                  <th scope="col">Estimate Cost at Completion (m)</th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    18785.1
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center text-danger"
                  >
                    The project is predicted to exceed its original cost.
                  </th>
                </tr>
                <tr>
                  <th scope="col">Estimate Cost to Complete (m)</th>
                  <th scope="col" className="fw-normal table-info text-center">
                    16185.1
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-info text-center text-danger"
                  >
                    Further funds will be required for completion at the current
                    pace of work & funds utilization.&lt;1
                  </th>
                </tr>
                <tr>
                  <th scope="col">Earned Schedule (ES)</th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    1
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center text-danger"
                  >
                    Equivalent progress of only 1 Month achieved to date instead
                    of 1.9 months.
                  </th>
                </tr>
                <tr>
                  <th scope="col">Time Variance (TV)</th>
                  <th scope="col" className="fw-normal table-info text-center">
                    -0.9
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-info text-center text-danger"
                  >
                    Difference between time passed & earned schedule&lt;1
                  </th>
                </tr>
                <tr>
                  <th scope="col">Time Estimate at Completion (TEAC)</th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    12
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center text-danger"
                  >
                    12 months will be required to complete this project at the
                    current pace
                  </th>
                </tr>
              </tbody>
            </table>

            <table
              className="table table-bordered border-light"
              style={{ backgroundColor: "rgb(180, 24, 24)" }}
            >
              <tbody>
                <tr>
                  <th className="text-center text-light">Alert:</th>
                  <th className="text-light">
                    Earned Value Analysis shows that the project would face time
                    and cost overrun if the same pace of work persists.
                  </th>
                </tr>
              </tbody>
            </table>

            {/* <!--Table 05 End--> */}

            {/* <!--Table 06 Start--> */}

            <h4 className="fw-bold pt-5" style={{ color: "#0070C0" }}>
              6. Financial Analysis
            </h4>
            <h5 className="text-center pt-5 fw-bold">Table 6</h5>
            <table className="table table-bordered border-light">
              <thead className="table-primary"></thead>
              <tbody className="">
                <tr>
                  <th scope="col" className="text-light text-center">
                    Fiscal Year
                  </th>
                  <th scope="col" className="text-light text-center">
                    Allocation (M)
                  </th>
                  <th scope="col" className="text-light text-center">
                    Releases (M)
                  </th>
                  <th scope="col" className="text-light text-center">
                    Utilization (M)
                  </th>
                  <th
                    scope="col"
                    className="text-light text-center"
                    colSpan={2}
                  >
                    Financial Efficiency
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    Release/Allocation
                  </th>
                  <th
                    scope="col"
                    className="fw-normal table-primary text-center"
                  >
                    Utilization/Releases
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    2023-24
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    6,000
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    6,000
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    2,900
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    100 %
                  </th>
                  <th scope="col" className="fw-normal table-info text-center">
                    48 %
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-center">
                    Total
                  </th>
                  <th scope="col" className="table-primary text-center">
                    6,000
                  </th>
                  <th scope="col" className="table-primary text-center">
                    6,000
                  </th>
                  <th scope="col" className="table-primary text-center">
                    2,900
                  </th>
                  <th scope="col" className="table-primary text-center">
                    100 %
                  </th>
                  <th scope="col" className="table-primary text-center">
                    48 %
                  </th>
                </tr>
              </tbody>
            </table>

            {/* <!--Table 06 End--> */}

            {/* <!--Table 07 Start--> */}
            <h4 className="fw-bold pt-5 pb-5" style={{ color: "#0070C0" }}>
              7. Observations & Recommendations
            </h4>
            <table className="table table-bordered border-light">
              <tbody>
                <tr>
                  <th scope="col" className="text-light">
                    Observations
                  </th>
                  <th scope="col" className="text-light">
                    {" "}
                    Description
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-light">
                    Observation 1 (Slow progress)
                  </th>
                  <th scope="col" className="fw-normal table-info">
                    Administrative Approval (AA) of the project was issued on
                    01-08-2023 at a cost of Rs. 17,785.849 M with a gestation
                    period of 6 months expiring on 01-02-2024. However, the work
                    was awarded to the contractor on 21-08-23. Also, it was
                    observed at the time of the visit that only 9% of progress
                    could be achieved in 01 month and 25 days, against a planned
                    progress of 30%, showing that the progress is lagging by
                    21%. The schedule performance index of the project, is less
                    than 1, depicting a slow pace of work.
                    <span className="fw-bold">Recommendation:</span> The
                    Executing agency may push the contractor to expedite work by
                    mobilizing adequate resources.
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-light">
                    Observation 2 (Project Cost Overrun)
                  </th>
                  <th scope="col" className="fw-normal table-primary">
                    The Cost Performance Index of the project, calculated from
                    earned value analysis, is less than 1 which indicates that
                    at the current pace and financial utilization, the project
                    may face cost overrun.
                    <span className="fw-bold">Recommendation:</span> The
                    Executing Department may take appropriate measures to ensure
                    completion of the project within approved cost.
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-light">
                    Observation 3 (Pile Load Test)
                  </th>
                  <th scope="col" className="fw-normal table-info">
                    Pile load test was not performed before constructing the
                    actual concrete pile of any bridge at the site.
                    Non-conformance with the standard testing raises concerns
                    about the structural integrity and safety of the foundation.
                    <span className="fw-bold">Recommendation:</span> The
                    Executing department must ensure the detailed load pile
                    testing to confirm the capacity, integrity and settlement as
                    per the design requirement of Bridge Foundation.
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-light">
                    Observation 4 (Inappropriate Embankment Material)
                  </th>
                  <th scope="col" className="fw-normal table-primary">
                    It was observed that at some portions of the site debris of
                    the dismantled buildings was spread over sub grade of the
                    embankment which may cause poor compaction. [Figure 01]
                    <span className="fw-bold">Recommendation:</span> The
                    Executing department should ensure the removal of debris and
                    usage of engineered approved borrowed material for
                    earthwork.
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-light">
                    Observation 5 (Delay in shifting of utilities)
                  </th>
                  <th scope="col" className="fw-normal table-info">
                    Shifting of the electric lines and poles is still pending.
                    [Figure 02]
                    <span className="fw-bold">Recommendation:</span> Timely
                    Shifting of utilities may be ensured to avoid further delay.
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-light">
                    Observation 6 (Non-barricaded Sites)
                  </th>
                  <th scope="col" className="fw-normal table-primary">
                    Bridge construction sites in the urban areas were
                    non-barricaded [Figure 03] and warning signs were not
                    displayed.
                    <span className="fw-bold">Recommendation:</span> Site
                    barricading and the hazard prevention sign may be displayed
                    to avoid untoward incidents.
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-light">
                    Observation 7 (Field laboratories)
                  </th>
                  <th scope="col" className="fw-normal table-info">
                    The contractor’s site laboratory has been established at a
                    distance of around 2 km from the site. Moreover, the
                    laboratory is not well equipped, which may compromise the
                    quality of construction. [Figure 04]
                    <span className="fw-bold">Recommendation:</span> The
                    Executing Department to ensure establishment of laboratory
                    at site along with availability of necessary equipment for
                    comprehensive testing of materials.
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-light">
                    Observation 8 (Non-provision of PPEs)
                  </th>
                  <th scope="col" className="fw-normal table-primary">
                    It was observed that the workers were not provided personal
                    protection equipment by the contractor [Figure 05].
                    <span className="fw-bold">Recommendation:</span> Personal
                    protection equipment should be provided to the workers.
                  </th>
                </tr>
              </tbody>
            </table>

            {/* <!--Table 07 End--> */}

            {/* <!--Photo Gallery--> */}
            <h4 className="fw-bold pt-5 pb-5" style={{ color: "#0070C0" }}>
              8. Photo Gallery
            </h4>
            <div className="text-center">
              <Image
                src={Picture3}
                className="rounded"
                alt="..."
                style={{ width: "75%" }}
              />
              <h5 className="fw-bold">
                Figure 01{" "}
                <span className="fw-normal">
                  [Dismantled Material laid for embankment formation]
                </span>
              </h5>
            </div>
            <div className="text-center">
              <Image
                src={Picture4}
                className="rounded"
                alt="..."
                style={{ width: "75%" }}
              />
              <h5 className="fw-bold">
                Figure 02{" "}
                <span className="fw-normal">
                  [Shifting of the Utility lines was remaining]
                </span>
              </h5>
            </div>
          </div>
          <div className="text-center">
            <Image
              src={Picture5}
              className="rounded"
              alt="..."
              style={{ width: "75%" }}
            />
            <h5 className="fw-bold">
              Figure 03{" "}
              <span className="fw-normal">
                [Non-Barricaded Bridge Construction site Bahria Town]
              </span>
            </h5>
          </div>
          <div className="text-center">
            <Image
              src={Picture6}
              className="rounded"
              alt="..."
              style={{ width: "75%" }}
            />
            <h5 className="fw-bold">
              Figure 04{" "}
              <span className="fw-normal">
                [Missing Essential Apparatus at Site Laboratory]
              </span>
            </h5>
          </div>
          <div className="text-center">
            <Image
              src={Picture7}
              className="rounded"
              alt="..."
              style={{ width: "75%" }}
            />
            <h5 className="fw-bold">
              Figure 05{" "}
              <span className="fw-normal">
                [Workers without Personal Protection Equipment]
              </span>
            </h5>
          </div>

          {/* <!--Photo Gallery End--> */}
        </div>
      </div>
    </>
  );
};

export default DownloadFile;
