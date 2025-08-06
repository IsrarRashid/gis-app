"use client";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal";
import useDepartments from "@/app/hooks/useDepartments";
import useUsers from "@/app/hooks/useUsers";
import { customSelectStyles, OptionType } from "@/app/utils";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { RiExpandUpDownFill } from "react-icons/ri";
import Select, { ActionMeta, SingleValue } from "react-select";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SummaryDashboard = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);
  const { data: users } = useUsers();
  const { data: departments } = useDepartments();
  const [menuPortalTarget, setMenuPortalTarget] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    // This code only runs on the client side after the component mounts
    setMenuPortalTarget(document.body);
  }, []);

  const commissionerOptions = users?.map((d) => {
    return {
      value: d.name,
      label: d.name,
    };
  });

  const departmentOptions = departments?.map((d) => {
    return {
      value: d.name,
      label: d.name,
    };
  });

  const tabs = [
    // {
    //   tabName: "All",
    //   count: 4,
    //   icon: <FaFile size={30} className="color-sea-blue" />,
    //   selectLabel: "Name",
    //   selectOptions: [{ option: "" }],
    // },
    {
      tabName: "Commissioner",
      count: 1,
      icon: (
        <Image
          src="/icons/user-5.svg"
          alt="user-4"
          width={16}
          height={16}
          className="color-sea-blue"
        />
      ),
      selectLabel: "Name",
      selectOptions: commissionerOptions,
    },
    {
      tabName: "Deputy Commissioner",
      count: 1,
      icon: (
        <Image
          src="/icons/user-4.svg"
          alt="user-4"
          width={16}
          height={16}
          className="color-sea-blue"
        />
      ),
      selectLabel: "Name",
      selectOptions: commissionerOptions,
    },
    {
      tabName: "Sponsoring Agency",
      count: 1,
      icon: (
        <Image
          src="/icons/building-1.svg"
          alt="building-1"
          width={16}
          height={16}
          className="color-sea-blue"
        />
      ),
      selectLabel: "Department",
      selectOptions: departmentOptions,
    },
    {
      tabName: "Executing Agency",
      count: 1,
      icon: (
        <Image
          src="/icons/building-2.svg"
          alt="building-2"
          width={16}
          height={16}
          className="color-sea-blue"
        />
      ),
      selectLabel: "Department",
      selectOptions: departmentOptions,
    },
    // {
    //   tabName: "DGME",
    //   count: 0,
    //   icon: <RiBuildingFill size={30} className="color-sea-blue" />,
    //   selectLabel: "",
    //   selectOptions: [{ option: "" }],
    // },
  ];

  const handleSelectChange = (
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    console.log({ newValue, actionMeta });
    /* your state handling logic */
  };

  return (
    <div className={plusJakartaSans.className}>
      <div
        style={{
          padding: "0px 15px",
          margin: "0px",
        }}
      >
        <div className="row g-2 g-lg-3 mb-3">
          <div className="col-12 col-sm-6 col-md-6 col-lg-2 ps-0">
            <div
              className="row d-flex align-items-center bg-white m-0"
              style={{
                padding: "20px 10px 21px 10px",
                borderRadius: "20px",
              }}
              onClick={() => setSelectedTab(0)}
            >
              <div
                className="col-auto rounded-circle flex items-center justify-center"
                style={{
                  background: "#F4F7FE",
                  padding: "10px",
                }}
              >
                <Image
                  src="/icons/file2.svg"
                  alt="file2"
                  width={16}
                  height={16}
                  className="color-sea-blue"
                />
              </div>
              <div className="col pe-0" style={{ paddingLeft: "10px" }}>
                <p
                  className="fw-5 fs14px"
                  style={{ color: "#4D5878", marginBottom: "7px" }}
                >
                  All
                </p>
                <p className="fw-bold fs18px mb-0" style={{ color: "#1F3D57" }}>
                  4&nbsp;&nbsp;
                  <span className="fs12px fw-5" style={{ color: "#A3AED0" }}>
                    Total Visits
                  </span>
                </p>
              </div>
            </div>
          </div>
          {tabs?.map((tab, i) => (
            <div key={i} className="col-12 col-sm-6 col-md-6 col-lg-2 ps-0">
              <CustomModal
                modalId={"tab" + i}
                showCloseButton={false}
                buttonColumn="col p-0"
                button={
                  <div
                    className="row d-flex align-items-center bg-white cursor-pointer m-0"
                    style={{
                      padding: "20px 10px 21px 10px",
                      borderRadius: "20px",
                      boxShadow:
                        selectedTab === i
                          ? "0px 0px 0px 2px rgba(12, 140, 233, 0.5)"
                          : "",

                      transition: "all .3s",
                    }}
                    onClick={() => setSelectedTab(i)}
                  >
                    <div
                      className="col-auto rounded-circle flex items-center justify-center"
                      style={{
                        background: "#F4F7FE",
                        padding: "10px",
                      }}
                    >
                      {tab.icon}
                    </div>
                    <div className="col pe-0" style={{ paddingLeft: "10px" }}>
                      <p
                        className="fw-5 fs12px "
                        style={{ color: "#4D5878", marginBottom: "7px" }}
                      >
                        {tab.tabName}
                      </p>
                      <p
                        className="fw-bold fs18px mb-0"
                        style={{ color: "#1F3D57" }}
                      >
                        {tab.count}&nbsp;&nbsp;
                        <span
                          className="fs12px fw-5"
                          style={{ color: "#A3AED0" }}
                        >
                          Total Visits
                        </span>
                      </p>
                    </div>
                  </div>
                }
                body={
                  <div
                    className={manrope.className}
                    style={{
                      background: "#F1F6F7",
                      borderRadius: "15px",
                      padding: "25px 0px",
                    }}
                  >
                    <p
                      className="fs24px fw-bold py-2 text-center"
                      style={{
                        background: "#E4EDEC",
                        marginBottom: "25px",
                        color: "#155E95",
                      }}
                    >
                      Select {tab.tabName}
                    </p>
                    <div
                      className="col"
                      style={{ marginBottom: "25px", padding: "0px 30px" }}
                    >
                      <label
                        htmlFor="commissioner"
                        className="form-label form-label-color-black fw-5 fs14px"
                        style={{ marginBottom: "6px" }}
                      >
                        {tab.selectLabel}
                      </label>
                      {menuPortalTarget && (
                        <Select
                          options={tab.selectOptions}
                          name="districtName"
                          id="districtName"
                          isClearable
                          isSearchable
                          styles={customSelectStyles}
                          menuPlacement="auto"
                          menuPosition="absolute"
                          menuPortalTarget={menuPortalTarget}
                          onChange={handleSelectChange}
                        />
                      )}
                      {/* <select
                      className="form-select form-select-sm color-light-dark shadow-none"
                      style={{ background: "rgba(255, 255, 255, 0.8)" }}
                      aria-label="Default select example"
                      name="commissioner"
                      id="commissioner"
                    >
                      <option value="Ali Jibran">
                        {tab.selectOptions[0].option}
                      </option>
                    </select> */}
                    </div>
                    <div style={{ padding: "0px 30px" }}>
                      <Button
                        className="btn text-white w-100 border-0 fs14px fw-bold"
                        style={{
                          backgroundImage:
                            "linear-gradient(to bottom, #0C8CE9 , #074F83)",
                          padding: "11px 16px",
                          borderRadius: "10px",
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                }
              />
            </div>
          ))}
          <div className="col-12 col-sm-6 col-md-6 col-lg-2 ps-0">
            <div
              className="row d-flex align-items-center bg-white m-0"
              style={{
                padding: "20px 10px 21px 10px",
                borderRadius: "20px",
              }}
            >
              <div
                className="col-auto rounded-circle flex items-center justify-center"
                style={{
                  background: "#F4F7FE",
                  padding: "10px",
                }}
              >
                <Image
                  src="/icons/building-3.svg"
                  alt="building-3"
                  width={16}
                  height={16}
                  className="color-sea-blue"
                />
              </div>
              <div className="col pe-0" style={{ paddingLeft: "10px" }}>
                <p
                  className="fw-5 fs14px"
                  style={{ color: "#4D5878", marginBottom: "7px" }}
                >
                  DGME
                </p>
                <p className="fw-bold fs18px mb-0" style={{ color: "#1F3D57" }}>
                  0&nbsp;&nbsp;
                  <span className="fs12px fw-5" style={{ color: "#A3AED0" }}>
                    Total Visits
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col bg-white fs21px"
          style={{
            border: "1px solid #E2E4E5",
            borderRadius: "10px",
            color: "#1E293B",
            fontWeight: 800,
          }}
        >
          <div
            className="row d-flex align-items-center "
            style={{
              padding: "17px 26px",
            }}
          >
            <div className="col">
              <div className="row d-flex align-items-center">
                <div className="col-auto pe-0">No. of Visits</div>
                {/* <div className="col">
                  <span
                    className="badge rounded-pill"
                    style={{ border: "1px solid #1C6BA6", color: "#1C6BA6" }}
                  >
                    <VscCircleFilled />
                    &nbsp;665/665 visits
                  </span>
                </div> */}
              </div>
            </div>
            <div className="col">
              <div className="row gap-2 align-items-center justify-content-end">
                <div className="col-auto p-0">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="input-group">
                      <div
                        className="rounded-end rounded-pill text-white shadow-none border-end-0"
                        style={{
                          border: "1px solid #CBD5E1",
                          padding: "4px 0px 8px 17px",
                        }}
                      >
                        <FiSearch size={21} style={{ color: "#475569" }} />
                      </div>
                      <input
                        type="text"
                        className="form-control border-start-0 rounded-pill rounded-start shadow-none fs15px fw-bold bg-transparent placeholder-bold"
                        style={{
                          border: "1px solid #CBD5E1",
                          color: "#475569",
                          padding: "10px 17px 10px 8px",
                        }}
                        placeholder="Search"
                      />
                    </div>
                  </form>
                </div>
                {/* <div className="col-auto p-0">
                  <Button
                    className="btn fw-bold bg-color-sea-blue text-white rounded-pill"
                    style={{ padding: "10px 17px" }}
                  >
                    <CgOptions size={21} />
                    District
                  </Button>
                </div> */}
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th
                    className="fs15px"
                    scope="col"
                    style={{
                      background: "#F8FAFC",
                      padding: "15px 26px",
                      borderBottom: "1px solid #CBD5E1",
                    }}
                  >
                    <div className="row d-flex flex-nowrap justify-content-center align-items-center">
                      <div className="col-auto text-nowrap pe-0">GS No.</div>
                      <div
                        className="col"
                        style={{ padding: "0px 0px 0px 13px" }}
                      >
                        <RiExpandUpDownFill size={21} />
                      </div>
                    </div>
                  </th>
                  <th
                    className="fs15px"
                    scope="col"
                    style={{
                      background: "#F8FAFC",
                      padding: "15px 26px",
                      borderBottom: "1px solid #CBD5E1",
                    }}
                  >
                    <div className="row d-flex flex-nowrap justify-content-center align-items-center">
                      <div className="col-auto text-nowrap pe-0">
                        Project Name
                      </div>
                      <div
                        className="col"
                        style={{ padding: "0px 0px 0px 13px" }}
                      >
                        <RiExpandUpDownFill size={21} />
                      </div>
                    </div>
                  </th>
                  <th
                    className="fs15px"
                    scope="col"
                    style={{
                      background: "#F8FAFC",
                      padding: "15px 26px",
                      borderBottom: "1px solid #CBD5E1",
                    }}
                  >
                    <div className="row d-flex flex-nowrap justify-content-center align-items-center">
                      <div className="col-auto text-nowrap pe-0">District</div>
                      <div
                        className="col"
                        style={{ padding: "0px 0px 0px 13px" }}
                      >
                        <RiExpandUpDownFill size={21} />
                      </div>
                    </div>
                  </th>
                  <th
                    className="fs15px"
                    scope="col"
                    style={{
                      background: "#F8FAFC",
                      padding: "15px 26px",
                      borderBottom: "1px solid #CBD5E1",
                    }}
                  >
                    <div className="row d-flex flex-nowrap justify-content-center align-items-center">
                      <div className="col-auto text-nowrap pe-0">
                        Commissioner Visit
                      </div>
                      <div
                        className="col"
                        style={{ padding: "0px 0px 0px 13px" }}
                      >
                        <RiExpandUpDownFill size={21} />
                      </div>
                    </div>
                  </th>
                  <th
                    className="fs15px"
                    scope="col"
                    style={{
                      background: "#F8FAFC",
                      padding: "15px 26px",
                      borderBottom: "1px solid #CBD5E1",
                    }}
                  >
                    <div className="row d-flex flex-nowrap justify-content-center align-items-center">
                      <div className="col-auto text-nowrap pe-0">DC Visit</div>
                      <div
                        className="col"
                        style={{ padding: "0px 0px 0px 13px" }}
                      >
                        <RiExpandUpDownFill size={21} />
                      </div>
                    </div>
                  </th>
                  <th
                    className="fs15px"
                    scope="col"
                    style={{
                      background: "#F8FAFC",
                      padding: "15px 26px",
                      borderBottom: "1px solid #CBD5E1",
                    }}
                  >
                    <div className="row d-flex flex-nowrap justify-content-center align-items-center">
                      <div className="col-auto text-nowrap pe-0">
                        Sponsoring Agency Visit
                      </div>
                      <div
                        className="col"
                        style={{ padding: "0px 0px 0px 13px" }}
                      >
                        <RiExpandUpDownFill size={21} />
                      </div>
                    </div>
                  </th>
                  <th
                    className="fs15px"
                    scope="col"
                    style={{
                      background: "#F8FAFC",
                      padding: "15px 26px",
                      borderBottom: "1px solid #CBD5E1",
                    }}
                  >
                    <div className="row d-flex flex-nowrap justify-content-center align-items-center">
                      <div className="col-auto text-nowrap pe-0">
                        Executing Agency Visit
                      </div>
                      <div
                        className="col"
                        style={{ padding: "0px 0px 0px 13px" }}
                      >
                        <RiExpandUpDownFill size={21} />
                      </div>
                    </div>
                  </th>
                  <th
                    className="fs15px"
                    scope="col"
                    style={{
                      background: "#F8FAFC",
                      padding: "15px 26px",
                      borderBottom: "1px solid #CBD5E1",
                    }}
                  >
                    <div className="row d-flex flex-nowrap justify-content-center align-items-center">
                      <div className="col-auto text-nowrap pe-0">
                        DGM&E Visit
                      </div>
                      <div
                        className="col"
                        style={{ padding: "0px 0px 0px 13px" }}
                      >
                        <RiExpandUpDownFill size={21} />
                      </div>
                    </div>
                  </th>
                  <th
                    className="fs15px"
                    scope="col"
                    style={{
                      background: "#F8FAFC",
                      padding: "15px 26px",
                      borderBottom: "1px solid #CBD5E1",
                    }}
                  >
                    <div className="row d-flex flex-nowrap justify-content-center align-items-center">
                      <div className="col-auto text-nowrap pe-0">
                        Total Visit
                      </div>
                      <div
                        className="col"
                        style={{ padding: "0px 0px 0px 13px" }}
                      >
                        <RiExpandUpDownFill size={21} />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th
                    className="fs15px bg-white"
                    scope="row"
                    style={{
                      padding: "28px 26px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    706
                  </th>
                  <td
                    className="fs15px bg-white fw-5"
                    style={{
                      padding: "13px 26px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    CM Himmat Card Program for Persons with Disabilities (PWDs)
                  </td>
                  <td
                    className="fs15px bg-white fw-5"
                    style={{
                      padding: "13px 26px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    Sialkot
                  </td>
                  <td
                    className="fw-5 fs15px bg-white color-sea-blue text-decoration-underline text-center cursor-pointer"
                    style={{
                      padding: "13px 26px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                    onClick={() =>
                      router.push("/dashboard-summary/summary-detail")
                    }
                  >
                    1
                  </td>
                  <td
                    className="fw-5 fs15px bg-white color-sea-blue text-decoration-underline text-center cursor-pointer"
                    style={{
                      padding: "13px 26px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                    onClick={() =>
                      router.push("/dashboard-summary/summary-detail")
                    }
                  >
                    1
                  </td>
                  <td
                    className="fw-5 fs15px bg-white color-sea-blue text-decoration-underline text-center cursor-pointer"
                    style={{
                      padding: "13px 26px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                    onClick={() =>
                      router.push("/dashboard-summary/summary-detail")
                    }
                  >
                    1
                  </td>
                  <td
                    className="fw-5 fs15px bg-white color-sea-blue text-decoration-underline text-center cursor-pointer"
                    style={{
                      padding: "13px 26px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                    onClick={() =>
                      router.push("/dashboard-summary/summary-detail")
                    }
                  >
                    1
                  </td>
                  <td
                    className="fw-5 fs15px bg-white color-sea-blue text-decoration-underline text-center cursor-pointer"
                    style={{
                      padding: "13px 26px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    0
                  </td>
                  <td
                    className="fw-5 fs15px bg-white color-sea-blue text-center"
                    style={{
                      padding: "13px 26px",
                      borderBottom: "1px solid #E2E8F0",
                    }}
                  >
                    4
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;

{
  /* <div
          className="row d-flex justify-content-between align-items-center"
          style={{ padding: "32px" }}
        >
          <div className="col-auto">
            <h5
              className="m-0"
              style={{ fontSize: "1.875rem", fontWeight: "800" }}
            >
              Summary Dashboard
            </h5>
          </div>

          <div className="col-auto my-auto">
            <div className="row d-flex justify-content-end">
              <div className="col">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="input-group">
                    <button
                      className="btn rounded-end rounded-pill text-white shadow-none border-end-0 pe-0"
                      type="submit"
                      style={{
                        border: "1px solid rgba(38, 50, 56,.6)",
                      }}
                    >
                      <Image
                        src={search3}
                        alt="search3"
                        width={18}
                        height={18}
                      />
                    </button>
                    <input
                      type="text"
                      className="form-control border-start-0 rounded-pill rounded-start shadow-none fs14px bg-transparent py-2"
                      style={{
                        border: "1px solid rgba(38, 50, 56,.6)",
                        color: "rgba(38, 50, 56,1)",
                      }}
                      placeholder="Search"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="row d-flex mb-3">
          <div className="col">
            <div className="btn-group d-flex" role="group">
              {tabs?.map((tab, i) => (
                <div className="col-auto">
                  <Button
                    className={`btn shadow-none rounded-0 fw-bold position-relative border-end-0 border-start-0 ${
                      selectedTab === i ? "text-dark" : "text-secondary"
                    }`}
                    style={{
                      borderBottom:
                        selectedTab === i
                          ? "2px solid #0c8ce9"
                          : "2px solid #E2E8F0",
                      padding: "12px 16px",
                    }}
                    onClick={() => {
                      setSelectedTab(i);
                    }}
                  >
                    {tab.tabName} &nbsp;
                    <span
                      className="badge rounded-pill color-sea-blue fw-6"
                      style={{
                        background: "#EEF2FF",
                        border: "1px solid #A5B4FC",
                      }}
                    >
                      {tab.count}
                    </span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div> */
}
