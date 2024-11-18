import Image from "next/image";
import car1Right from "@/public/icons/car1Right.svg";
import car2Left from "../../../public/images/car2Left.png";
import car3Left from "../../../public/images/car3Left.png";
import carFrontBlue from "../../../public/icons/carFrontBlue.svg";
import { useEffect, useRef, useState } from "react";
import fuel from "../../../public/icons/fuel.svg";
import seat from "../../../public/icons/seat.svg";
import transmission from "../../../public/icons/transmission.svg";
import Button from "@/app/components/Button";
import apiClient from "@/app/services/api-client";
import { vehicleApi } from "@/app/APIs";
import useVehicle from "@/app/hooks/useVehicle";

interface AvailableVehicles {
  vehicleId: number;
  visitId: number;
  driverId: number;
  name: string;
  description: string;
  vehicleNumber: string;
  model: string;
  color: string;
  trasnmission: string;
  seatsCapacity: number;
  fuelType: string;
  vehicleImage: string;
  vehicleIcon: string;
  driverName: string;
  mobileNumber: string;
  driverImage: string;
}

const Vehicles = () => {
  const [status, setStatus] = useState<string>("available");
  const [data, setData] = useState<AvailableVehicles[]>();
  const [refresh, setRefresh] = useState(false);
  const { data: vehicles } = useVehicle({ refresh });

  const items2 = [
    {
      driderName: "Jamshed Ali",
      carName: "Toyota Corolla GLi",
      carIcon: car1Right,
    },
    {
      driderName: "Hammad",
      carName: "Suzuki Alto",
      carIcon: car3Left,
    },
    {
      driderName: "Haroon",
      carName: "Suzuki Swift",
      carIcon: car2Left,
    },
    {
      driderName: "Jamshed Ali",
      carName: "Toyota Corolla GLi",
      carIcon: car1Right,
    },
    {
      driderName: "Hammad",
      carName: "Suzuki Alto",
      carIcon: car3Left,
    },
    {
      driderName: "Haroon",
      carName: "Suzuki Swift",
      carIcon: car2Left,
    },
  ];

  // const refContainer2 = useRef<HTMLDivElement>(null);
  // const refContent2 = useRef<HTMLDivElement>(null);
  // const [constraints2, setConstraints2] = useState({});

  // useEffect(() => {
  //   // Wait until both container and content are rendered
  //   if (refContainer2.current && refContent2.current) {
  //     // Calculate the width difference between container and content
  //     const containerHeight = refContainer2.current.offsetHeight;
  //     const contentHeight = refContent2.current.scrollHeight;
  //     // Set drag constraints dynamically based on the difference
  //     setConstraints2({ bottom: 0, top: -(contentHeight - containerHeight) });
  //   }
  // }, [data, status]); // Recalculate if the items change

  const handleSubmit = async (status: string) => {
    try {
      const response = await apiClient.get(
        `${vehicleApi}/GetVehiclesList?status=${status}`
      );
      console.log("Response:", response);
      setData(response.data.data);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    handleSubmit(status);
  }, []);

  return (
    <div
      className="col shadow-sm mb-3 ms-2 me-2"
      style={{ background: "#C6D9F1", borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div className="col pt-2 ms-3 me-3">
        <div className="row d-flex m-0">
          <div className="col">
            <h4
              className="fw-bold mt-2 fs18px"
              style={{
                color: "#0153AF",
                letterSpacing: "1px",
              }}
            >
              Vehicles
            </h4>
          </div>
          {/* <div className="col text-end">
            <Button
              className="btn p-1 mt-1 fs12px"
              style={{
                padding: "15px 20px 15px 20px",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
            >
              See All
            </Button>
          </div> */}
        </div>
      </div>
      {/* <div className="row d-flex mb-1">
        <div className="col text-center pe-0">
          <Button
            className="btn mt-2 p-0 w-100 fs14px rounded-0"
            style={{
              borderBottom:
                status === "available"
                  ? "2px solid #0153AF"
                  : "2px solid #E0E0E0",
              letterSpacing: "1px",
              outline: "none",
              boxShadow: "none",
            }}
            onClick={() => {
              setStatus("available");
              handleSubmit("available");
            }}
          >
            Available
          </Button>
        </div>
        <div className="col text-center ps-0">
          <Button
            className="btn mt-2 p-0 w-100 fs14px rounded-0"
            style={{
              letterSpacing: "1px",
              borderBottom:
                status === "in_use" ? "2px solid #0153AF" : "2px solid #E0E0E0",
              outline: "none",
              boxShadow: "none",
            }}
            onClick={() => {
              setStatus("in_use");
              handleSubmit("in_use");
            }}
          >
            In Use
          </Button>
        </div>
      </div> */}
      {vehicles && (
        <div className="row d-flex pt-0 pb-2 m-2 ms-0 me-0">
          <div
            className="col-lg-12 col-md-12 col-sm-12 p-2"
            style={{
              height: "580px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              overflowY: "scroll",
              position: "relative",
              borderRadius: "12px",
            }}
          >
            {vehicles?.map((d, i) => (
              <div
                key={i}
                className="row d-flex p-2 mb-2 ms-0 me-0"
                style={{
                  background: "#F4F6F9",
                  border: "1px solid #D5DEEF",
                  borderRadius: "12px",
                }}
              >
                <div className="row d-flex pe-0 m-0">
                  <div className="col-lg-12 col-md-12 col-sm-12 p-0 m-0 text-center">
                    {d.vehicleImage && d.vehicleImage.length > 0 ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.vehicleImage}`}
                        alt="vehicle image from api"
                        style={{
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                        className="img-fluid"
                      />
                    ) : (
                      <Image
                        src={car1Right}
                        alt="vehicle image"
                        style={{ width: "auto", height: "auto" }}
                        className="img-fluid"
                      />
                    )}
                  </div>
                  {/* <div className="col-lg-1 col-md-1 col text-end p-0">
                    <FavioriteBtn />
                  </div> */}
                </div>
                <div
                  className="row ps-0 pe-0 m-0 pb-1 mb-2"
                  style={{ borderBottom: "1px solid #E5E1E1" }}
                >
                  <p
                    className="m-0 fs12px fw-bold"
                    style={{ color: "#888888" }}
                  >
                    {d.name}
                  </p>
                  <div className="row d-flex m-0 pe-1">
                    <div className="col p-0">
                      <p className="m-0 fs14px fw-bold">{d.description}</p>
                    </div>
                    {/* <div className="col p-0">
                      <p
                        className="m-0 fs12px fw-normal text-end"
                        style={{ color: "#757575" }}
                      >
                        001031 KM
                      </p>
                    </div> */}
                  </div>
                </div>
                <div className="row d-flex m-0 justify-content-between">
                  <div
                    className="col fs10px p-0 text-center"
                    style={{ color: "#B3B3B3" }}
                  >
                    <Image
                      src={carFrontBlue}
                      alt="carFrontBlue"
                      width={15}
                      style={{ marginBottom: "3px" }}
                      height={14}
                    />{" "}
                    {d.vehicleNumber}
                  </div>
                  <div
                    className="col fs10px p-0 text-center"
                    style={{ color: "#B3B3B3" }}
                  >
                    <Image
                      src={transmission}
                      alt="transmission"
                      width={15}
                      style={{ marginBottom: "3px" }}
                      height={14}
                    />{" "}
                    {d.trasnmission}
                  </div>{" "}
                  <div
                    className="col fs10px p-0 text-center"
                    style={{ color: "#B3B3B3" }}
                  >
                    <Image
                      src={fuel}
                      alt="fuel"
                      width={15}
                      style={{ marginBottom: "3px" }}
                      height={14}
                    />{" "}
                    {d.fuelType}
                  </div>{" "}
                  <div
                    className="col fs10px p-0 text-center"
                    style={{ color: "#B3B3B3" }}
                  >
                    <Image
                      src={seat}
                      alt="seat"
                      width={15}
                      style={{ marginBottom: "3px" }}
                      height={14}
                    />{" "}
                    {d.seatsCapacity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
