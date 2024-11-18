"use client";
import { Lexend } from "next/font/google";
import { useEffect, useState } from "react";
import Visits from "./Visits";
import { useDispatch } from "react-redux";
import { setContent } from "@/app/features/content/contentSlice";
import ScheduleVisit from "./ScheduleVisit";
import MapCars from "./Map/MapCars";
import MapCarsRecorded from "./Map/MapCarsRecorded";
import Button from "@/app/components/Button";
import StaffMember from "./StaffMember";
import useAuthorization from "@/app/hooks/useAuthorization";
import LiveStaffTrackingMap from "./GoogleMap/LiveStaffTrackingMap";
import apiClient from "@/app/services/api-client";
import { staffTrackingAPI, visitAPI } from "@/app/APIs";
import useVisits from "@/app/hooks/useVisits";
import MapRecordingModal from "./MapRecordingModal";
import RecordingStaffTrackingMap from "./GoogleMap/RecordingStaffTrackingMap";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "300",
});

interface VisitByUserId {
  projectId: number;
  projectName: string;
  projectLat: string;
  projectLong: string;
  projectDistrict: string;
  driverName: string;
  driverImage: string;
  carNumber: string;
  carImage: string;
  visit: {
    id: number;
    projectId: number;
    assignedTo: number;
    status: string;
    latitude: string;
    longitude: string;
    vehicleID: number;
    driverID: number;
    fromDate: string;
    toDate: string;
    createdAt: string;
    updatedAt: string;
    reportPath: string;
  };
}

interface Coordinates {
  id: number;
  visitID: number;
  userID: number;
  latitude: string;
  longitude: string;
  createdAt: string;
}

export interface StaffTracking {
  userId: string;
  userName: string;
  designation: string;
  mobile: string;
  projectName: string;
  districtName: string;
  userPicture: string;
  planStartDate: string;
  planEndDate: string;
  visitStartTime: string;
  visitEndTime: string;
  carNumber: string;
  carPicture: string;
  driverName: string;
  status: string;
  startAddressLat: string;
  startAddressLong: string;
  endAddressLat: string;
  endAddressLong: string;
  coordinates: Coordinates[];
}

export interface TrackingRequestData {
  userId: number;
  visitId: number;
  date: string | null;
}

export interface OptionUser {
  id: number;
  name: string;
}

export interface OptionProject {
  id: number;
  name: string;
}

export interface OptionDate {
  id: number;
  name: string;
}

export interface Position {
  lat: number;
  lng: number;
}

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DashboardST = () => {
  const [mapStatus, setMapStatus] = useState(false);
  const dispatch = useDispatch();
  useAuthorization("dashboardST");
  const [userId, setUserId] = useState<number>();
  const [visitId, setVisitId] = useState<number>();
  const [visits, setVisits] = useState();
  const [refresh, setRefresh] = useState(false);

  const [data, setData] = useState<StaffTracking[]>();
  const [trackingRequestBody, setTrackingRequestBody] =
    useState<TrackingRequestData>({
      userId: 0,
      visitId: 0,
      date: getCurrentDate(), //remember to set current date
    });
  const [markerPositions, setMarkerPositions] = useState<{
    [key: string]: { lat: number; lng: number };
  }>({});

  const getStaffWithCoordinates = async (
    trackingRequestBody: TrackingRequestData
  ) => {
    try {
      const response = await apiClient.post(
        staffTrackingAPI,
        trackingRequestBody
      );
      if (response.data.data) {
        setData(response.data.data);
        console.log("new data response", response);
        // Update each marker position with interpolation
        response.data.data.forEach((d: any) => {
          const userId = d.userId;
          const newLat = parseFloat(
            d.coordinates[d.coordinates.length - 1].latitude
          );
          const newLng = parseFloat(
            d.coordinates[d.coordinates.length - 1].longitude
          );
          const currentPos = markerPositions[userId] || {
            lat: newLat,
            lng: newLng,
          };

          // Smooth transition between current and new position
          const animateMarker = (startTime: number) => {
            const duration = 3000;
            const progress = (Date.now() - startTime) / duration;

            if (progress < 1) {
              const interpolatedLat =
                currentPos.lat + progress * (newLat - currentPos.lat);
              const interpolatedLng =
                currentPos.lng + progress * (newLng - currentPos.lng);
              setMarkerPositions((prev) => ({
                ...prev,
                [userId]: { lat: interpolatedLat, lng: interpolatedLng },
              }));
              requestAnimationFrame(() => animateMarker(startTime));
            } else {
              // End animation by setting to final position
              setMarkerPositions((prev) => ({
                ...prev,
                [userId]: { lat: newLat, lng: newLng },
              }));
            }
          };

          // Start the animation
          animateMarker(Date.now());
        });
      } else {
        console.log("Something bad happened");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    if (!mapStatus) {
      const interval = setInterval(() => {
        getStaffWithCoordinates(trackingRequestBody);
        console.log("coordinates updated");
        console.log("request body", trackingRequestBody);
      }, 5000); // Call every 5 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [trackingRequestBody, markerPositions]);

  const handleButtonClick = (content: string) => {
    dispatch(setContent(content));
  };

  useEffect(() => {
    // Set the background for the body
    document.body.style.background = "#CFE6F8";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";

    handleButtonClick("Dashboard");
    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <div
      className={`container-fluid p-3 mb-4 ${lexend.className}`}
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <div className="row mb-3 ms-2 me-2">
        <div className="col-lg-8 col-md-12 col-sm-12 position-relative">
          <div className="row">
            <div className="col">
              <div
                className="col position-absolute text-end"
                style={{ zIndex: 1, right: 80, top: 12 }}
              >
                <MapRecordingModal
                  setMapStatus={setMapStatus}
                  setTrackingRequestBody={setTrackingRequestBody}
                  trackingRequestBody={trackingRequestBody}
                />
              </div>
              <div className="position-relative" style={{ zIndex: 0 }}>
                {/* {mapStatus ? <MapCarsRecorded /> : <MapCars />} */}
                {mapStatus ? (
                  <RecordingStaffTrackingMap
                    trackingRequestBody={trackingRequestBody}
                  />
                ) : (
                  <LiveStaffTrackingMap
                    data={data}
                    markerPositions={markerPositions}
                  />
                )}
              </div>
              {/* <Visits /> */}
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-12 col-sm-12">
          {data && (
            <StaffMember
              setTrackingRequestBody={setTrackingRequestBody}
              setMapStatus={setMapStatus}
            />
          )}
          {/* <ScheduleVisit /> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardST;
