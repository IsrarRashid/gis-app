// "use client";
// import { sectorAPI } from "@/app/APIs";
// import SectorForm from "./SectorForm";
// import { getFormattedDate } from "@/app/utils";
// import useSectors from "@/app/hooks/useProjects";
// import { Sector } from "@/app/hooks/useSectors";
// import apiClient, { AxiosError } from "@/app/services/api-client";
// import { ToastContainer, toast } from "react-toastify";

// interface Props {
//   refresh: boolean;
//   setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const TopMenu = ({ refresh, setRefresh }: Props) => {
//   const { data, error, isLoading } = useSectors({ refresh });
//   const createdMessage = "Created Successfully";
//   const notifyCreate = (message: string) => toast.success(message);
//   const notifyError = (message: string) => toast.error(message);

//   const onSubmit = async (formData: Sector) => {
//     console.log("Form Data:", formData);
//     try {
//       const response = await apiClient.post(sectorAPI, formData);

//       if (response.status === 200) {
//         console.log("Response:", response);
//         setRefresh((prev) => !prev);
//         notifyCreate(createdMessage);
//       }
//     } catch (err) {
//       console.error("Submission error:", err);
//       notifyError((err as AxiosError).message);
//     }
//   };

//   return (
//     <>
//       {error && <p className="text-danger">{error}</p>}
//       {isLoading && (
//         <div className="col text-center">
//           <div className="spinner-border text-primary"></div>
//         </div>
//       )}
//       <div className="row d-flex p-3">
//         <div className="col-lg-6 col-md-6 col-sm-12">
//           <h4 className="fw-bold">Sectors</h4>
//         </div>
//         <div className="col-lg-6 col-md-6 col-sm-12">
//           <div className="row d-flex ">
//             <div className="col d-none d-lg-block"></div>
//             <div className="col text-end">
//               <span className="fw-bold">{getFormattedDate()}</span> Today
//             </div>
//             <div className="col text-end">
//               <SectorForm
//                 api={sectorAPI}
//                 method="POST"
//                 refresh={refresh}
//                 onSubmit={onSubmit}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="row p-3">
//         <div className="col-lg-6 col-md-6 col-sm-12">
//           <p>
//             Showing: <span className="fw-bold">{data?.length} Sectors</span>
//           </p>
//         </div>
//         <ToastContainer />
//       </div>
//     </>
//   );
// };

// export default TopMenu;
