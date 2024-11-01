// "use client";
// import { useEffect, useRef, useState } from "react";
// import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import useDistrict from "@/app/hooks/useDistrict";
// import apiClient from "@/app/services/api-client";
// import { districtAPI } from "@/app/APIs";
// import DistrictCard from "./DistrictCard";
// import ProjectCard from "./ProjectCard";
// import districtLocation from "../../../../public/images/districtLocation.png";
// import projectLocation from "../../../../public/images/construction.png";

// const districtIcon = new L.Icon({
//   iconUrl: districtLocation.src,
//   iconSize: [60, 70],
//   iconAnchor: [25, 25],
// });

// const projectIcon = new L.Icon({
//   iconUrl: projectLocation.src,
//   iconSize: [30, 30],
//   iconAnchor: [25, 25],
// });

// export interface ProjectDetails {
//   id: number;
//   name: string;
//   latitude: string;
//   longitude: string;
// }

// const MapComponent = () => {
//   const [position, setPosition] = useState<[number, number]>();
//   const { data } = useDistrict({ refresh: false });
//   const [projectsLocation, setProjectsLocation] = useState<
//     ProjectDetails[] | null
//   >(null);
//   const [activeDistrictId, setActiveDistrictId] = useState<number | null>(null);

//   useEffect(() => {
//     if (data && data[0]) {
//       setPosition([
//         parseFloat(data[0]?.latitude),
//         parseFloat(data[0]?.longitude),
//       ]);
//     }
//   }, [data]);

//   const handleSubmit = async (districtId: number, showProjects: boolean) => {
//     if (showProjects) {
//       try {
//         const response = await apiClient.get(
//           `${districtAPI}/GetProjectByDistrict?districtId=${districtId}`
//         );
//         setProjectsLocation(response.data.data);
//         setActiveDistrictId(districtId);
//       } catch (err) {
//         console.error("Submission error:", err);
//       }
//     } else {
//       setProjectsLocation(null);
//       setActiveDistrictId(null);
//     }
//   };

//   const handleMarkerClick = (districtId: number) => {
//     const isActive = activeDistrictId === districtId;
//     handleSubmit(districtId, !isActive); // Toggle project markers
//   };

//   const MapUpdater = () => {
//     const map = useMap();

//     useEffect(() => {
//       const bounds = L.latLngBounds([]);
//       const markers =
//         activeDistrictId && projectsLocation ? projectsLocation : data;

//       // Extend bounds only if markers have valid latitude and longitude
//       markers
//         ?.filter((location) => location.latitude && location.longitude)
//         .forEach((location) => {
//           bounds.extend([
//             parseFloat(location.latitude),
//             parseFloat(location.longitude),
//           ]);
//         });

//       // Check if bounds contain valid points before calling fitBounds
//       if (bounds.isValid()) {
//         map.fitBounds(bounds, { padding: [50, 50] });
//       }
//     }, [map, data, projectsLocation, activeDistrictId]);

//     return null;
//   };

//   return (
//     <>
//       {data && position && (
//         <MapContainer
//           center={position}
//           zoom={17}
//           style={{
//             height: "550px",
//             width: "100%",
//             borderRadius: "10px",
//           }}
//           className="shadow-sm mb-2"
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           <MapUpdater />
//           {data.map((d) => (
//             <Marker
//               key={d.id}
//               position={[parseFloat(d.latitude), parseFloat(d.longitude)]}
//               icon={districtIcon}
//               eventHandlers={{
//                 click: () => handleMarkerClick(d.id),
//                 mouseover: (e) => e.target.openPopup(),
//                 mouseout: (e) => e.target.closePopup(),
//               }}
//             >
//               <Popup
//                 maxWidth={195}
//                 closeButton={false}
//                 offset={L.point(0, -16)}
//               >
//                 <DistrictCard data={d} />
//               </Popup>
//             </Marker>
//           ))}
//           {activeDistrictId &&
//             projectsLocation &&
//             projectsLocation
//               .filter((project) => project.latitude && project.longitude)
//               .map((project) => (
//                 <Marker
//                   key={project.id}
//                   position={[
//                     parseFloat(project.latitude),
//                     parseFloat(project.longitude),
//                   ]}
//                   icon={projectIcon}
//                   eventHandlers={{
//                     mouseover: (e) => e.target.openPopup(),
//                     mouseout: (e) => e.target.closePopup(),
//                   }}
//                 >
//                   <Popup
//                     maxWidth={195}
//                     closeButton={false}
//                     offset={L.point(0, -16)}
//                   >
//                     <ProjectCard data={project} />
//                   </Popup>
//                 </Marker>
//               ))}
//         </MapContainer>
//       )}
//     </>
//   );
// };

// export default MapComponent;
