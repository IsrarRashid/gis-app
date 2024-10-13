// import Modal from "react-bootstrap/Modal";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import more from "../../../public/icons/more.svg";
// import useAttributes from "@/app/hooks/useAttributes";
// import apiClient, { AxiosError } from "@/app/services/api-client";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import toast, { Toaster } from "react-hot-toast";
// import { useForm, useFieldArray, Controller } from "react-hook-form";

// const attributeSchema = z.object({
//   attributeId: z.number().optional().default(0),
//   attributeDataType: z.string().min(1, { message: "Please add DataType!" }),
//   multiselect: z.number().optional().default(0),
//   label: z.string().min(1, { message: "Please add Label!" }),
//   validationRegx: z.string().optional().default(""),
//   min: z.number().optional().default(0),
//   max: z.number().optional().default(0),
//   required: z.number().optional().default(0),
//   status: z.number().optional().default(0),
//   hidden: z.number().optional().default(0),
//   createdAt: z.string().optional().default(""),
//   updatedAt: z.string().optional().default(""),
//   placeholder: z.string().optional().default(""),
//   attributeType: z.string().optional().default(""),
//   unit: z.string().optional().default(""),
//   errorMessage: z.string().optional().default(""),
//   verificationType: z.string().optional().default(""),
//   sortId: z.number().optional().default(0),
//   remarks: z.string().optional().default(""),
//   weightage: z.number().optional().default(0),
//   attributeCode: z.string().optional().default(""),
//   evaluationFormula: z.string().optional().default(""),
// });

// type Attribute = z.infer<typeof attributeSchema>;

// const optionSchema = z
//   .object({
//     value: z.string().min(1, { message: "Please add Value!" }),
//     attributeId: z.number().optional().default(0),
//     sortId: z.number({ invalid_type_error: "Please add Sort Id!" }),
//     isActive: z.number().optional().default(0),
//     label: z.string().optional().default(""),
//     createdAt: z.string().optional().default(""),
//     updatedAt: z.string().optional().default(""),
//   })
//   .nullable();

// type Option = z.infer<typeof optionSchema>;

// interface Props {
//   api: string;
//   method: "POST" | "PUT" | "PATCH";
//   id?: number;
//   setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
//   refresh: boolean;
// }

// const Form = ({ api, method, id, setRefresh, refresh }: Props) => {
//   const { data, setError } = useAttributes({ refresh });
//   const [isRequired, setRequired] = useState(false);
//   const [isMultiSelect, setMultiSelect] = useState(false);
//   const [isStatus, setStatus] = useState(false);
//   const [isHidden, setHidden] = useState(false);
//   const [activeStates, setActiveStates] = useState<{ [key: number]: boolean }>(
//     {}
//   );
//   const modalId = `formModal-${id}`;
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     reset,
//     formState: { errors },
//     watch,
//     control,
//   } = useForm<Attribute>({ resolver: zodResolver(attributeSchema) });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "optionsData", // The name of the field array
//   });

//   const handleCheckboxChange = (index: number) => {
//     setActiveStates((prevStates) => ({
//       ...prevStates,
//       [index]: !prevStates[index],
//     }));
//   };

//   const handleDeleteOption = (index: number) => {
//     setOptionsData((prevData) => prevData.filter((_, i) => i !== index));
//   };

//   const [show, setShow] = useState(false);

//   const createdMessage = "Created Successfully";
//   const updatedMessage = "Updated Successfully";

//   const handleClose = () => {
//     setShow(false);
//     reset();
//   };
//   const handleShow = async () => {
//     setShow(true);

//     if (method === "PUT") {
//       try {
//         // send a POST request to the server to add the product
//         const response = await apiClient.get(`${api}/${id}`);
//         const itemData = response.data.data;
//         setValue("attributeId", itemData.attributeId);
//         setValue("attributeDataType", itemData.attributeDataType);
//         setValue("multiselect", itemData.multiselect);
//         setValue("label", itemData.label);
//         setValue("validationRegx", itemData.validationRegx);
//         setValue("min", itemData.min);
//         setValue("max", itemData.max);
//         setValue("required", itemData.required);
//         setValue("status", itemData.status);
//         setValue("hidden", itemData.hidden);
//         setValue("createdAt", itemData.createdAt);
//         setValue("updatedAt", itemData.updatedAt);
//         setValue("placeholder", itemData.placeholder);
//         setValue("attributeType", itemData.attributeType);
//         setValue("unit", itemData.unit);
//         setValue("errorMessage", itemData.errorMessage);
//         setValue("verificationType", itemData.verificationType);
//         setValue("sortId", itemData.sortId);
//         setValue("attributeCode", itemData.attributeCode);
//         setValue("evaluationFormula", itemData.evaluationFormula);
//         setValue("weightage", itemData.weightage);
//         setValue("remarks", itemData.remarks);

//         setRequired(itemData.required === 1 ? true : false);
//         setMultiSelect(itemData.multiselect === 1 ? true : false);
//         setStatus(itemData.status === 1 ? true : false);
//         setHidden(itemData.hidden === 1 ? true : false);
//       } catch (err) {
//         console.log((err as AxiosError).message);
//         toast.error((err as AxiosError).message);
//       }
//     }
//   };

//   const handleDatalistSelect = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       // Trim the existing and new values and join them with a single space
//       evaluationFormula: prevData.evaluationFormula
//         ? `${prevData.evaluationFormula.trim()} ${e.target.value.trim()}`
//         : e.target.value.trim(),
//     }));
//   };

//   const handleOptionChange = (
//     index: number,
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;
//     setOptionsData((prevOptions) =>
//       prevOptions.map((option, i) =>
//         i === index ? { ...option, [name]: value } : option
//       )
//     );
//   };

//   // Function to handle adding new option
//   const addNewOption = () => {
//     setOptionsData((prevOptions) => [
//       ...prevOptions,
//       {
//         value: "",
//         attributeId: 0,
//         sortId: 0,
//         isActive: 0,
//         label: "",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//     ]);
//   };

//   // useEffect(() => {
//   //   setFormData({
//   //     ...formData,
//   //     evaluationFormula:
//   //       formData.attributeType === "formula"
//   //         ? formData.evaluationFormula
//   //         : (formData.evaluationFormula = ""),
//   //     required: isRequired ? 1 : 0,
//   //     multiselect: isMultiSelect ? 1 : 0,
//   //     status: isStatus ? 1 : 0,
//   //     hidden: isHidden ? 1 : 0,
//   //   });
//   // }, [isRequired, isMultiSelect, isStatus, isHidden, formData.attributeType]);

//   // Update optionsData state when activeStates change
//   useEffect(() => {
//     setOptionsData((prevOptions) =>
//       prevOptions.map((option, i) => ({
//         ...option,
//         isActive: activeStates[i] === true ? 1 : 0,
//       }))
//     );
//   }, [activeStates]);

//   const onSubmit = async (formData: Attribute, optionsData: Option) => {
//     console.log("Form Data:", formData);
//     console.log(errors);
//     try {
//       const response = await apiClient({
//         method: method,
//         url: method === "POST" ? api : `${api}/${id}`,
//         data:
//           method === "POST"
//             ? {
//                 attribute: formData,
//                 options:
//                   formData.attributeType === "radio" ||
//                   formData.attributeType === "select" ||
//                   formData.attributeType === "checkbox"
//                     ? optionsData
//                     : null,
//               }
//             : formData,
//       });
//       console.log("Response:", response);
//       setRefresh((prev) => !prev);
//       toast.success(method === "POST" ? createdMessage : updatedMessage);
//       handleClose();
//     } catch (err) {
//       console.error("Submission error:", err);
//       toast.error((err as AxiosError).message);
//     }
//   };

//   return (
//     <>
//       <div>
//         <Toaster />
//       </div>
//       <Button
//         type="button"
//         className={`btn btn-sm ${
//           method === "POST" ? "text-white bg-color-sea-green" : "rounded-pill"
//         }`}
//         onClick={handleShow}
//         style={{ background: method === "POST" ? "" : "#fff" }}
//       >
//         {method === "POST" ? (
//           "+ Attribute"
//         ) : (
//           <Image src={more} alt="more" />
//         )}
//       </Button>

//       <Modal
//         size="xl"
//         show={show}
//         onHide={handleClose}
//         aria-labelledby="contained-modal-title-vcenter"
//         centered
//         dialogClassName="custom-modal"
//         id={modalId}
//       >
//         <Modal.Body
//           className="p-0"
//           style={{ background: "rgba(156,255,255,0)" }}
//         >
//           <div
//             className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
//             style={{
//               backgroundImage: "linear-gradient(to left, #969696 ,#d9d9d9)",
//               borderRadius: "20px",
//             }}
//           >
//             <div className="row flex-column justify-content-center mb-4">
//               <div className="col-lg-12">
//                 <p className="text-center text-white mt-4"
//   style={{ fontSize: "1.5rem", fontWeight: "800" }}
// >
//                   {method === "POST" ? "ADD ATTRIBUTE" : "UPDATE ATTRIBUTE"}
//                 </p>
//               </div>
//               <form
//                 className="ps-lg-4 pe-lg-4 ps-md-4 pe-md-4"
//                 onSubmit={handleSubmit(onSubmit)}
//               >
//                 <div className="row d-flex justify-content-between mb-3">
//                   <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
//                     <label htmlFor="label" className="form-label text-white">
//                       Label
//                     </label>
//                     <input
//                       {...register("label")}
//                       id="label"
//                       type="text"
//                       className="form-control form-control-sm color-light-dark bg-silver"
//                       placeholder="Enter Label"
//                     />
//                     {errors.label && (
//                       <p className="text-danger mt-1">{errors.label.message}</p>
//                     )}
//                   </div>
//                   <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
//                     <label
//                       htmlFor="placeholder"
//                       className="form-label text-white"
//                     >
//                       Placeholder
//                     </label>
//                     <input
//                       {...register("placeholder")}
//                       id="placeholder"
//                       type="text"
//                       className="form-control form-control-sm color-light-dark bg-silver"
//                       placeholder="Enter Placeholder"
//                     />
//                   </div>
//                   <div className="col-lg-4 col-md-6 col-sm-12 text-start">
//                     <label
//                       htmlFor="attributeDataType"
//                       className="form-label text-white"
//                     >
//                       Attribute DataType
//                     </label>
//                     <select
//                       {...register("attributeDataType")}
//                       className="form-select form-select-sm color-light-dark bg-silver"
//                     >
//                       <option value="">None</option>
//                       <option value="number">Number</option>
//                       <option value="string">String</option>
//                       <option value="date">Date</option>
//                     </select>
//                     {errors.label && (
//                       <p className="text-danger mt-1">{errors.label.message}</p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="row d-flex justify-content-between mb-3">
//                   <div className="col-lg-4 col-md-6 col-sm-12 text-start">
//                     <label
//                       htmlFor="attributeType"
//                       className="form-label text-white"
//                     >
//                       Attribute Type
//                     </label>
//                     <select
//                       {...register("attributeType")}
//                       className="form-select form-select-sm color-light-dark bg-silver"
//                     >
//                       <option value="">None</option>
//                       <option value="text">Text</option>
//                       <option value="select">Select</option>
//                       <option value="file">File</option>
//                       <option value="radio">Radio</option>
//                       <option value="slider">Slider</option>
//                       <option value="textarea">Textarea</option>
//                       <option value="progress">Progress</option>
//                       <option value="checkbox">Checkbox</option>
//                       <option value="formula">Formula</option>
//                     </select>
//                   </div>
//                   <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
//                     <label htmlFor="unit" className="form-label text-white">
//                       Unit
//                     </label>
//                     <input
//                       {...register("unit")}
//                       id="unit"
//                       type="text"
//                       className="form-control form-control-sm color-light-dark bg-silver"
//                       placeholder="Enter Unit"
//                     />
//                   </div>
//                   <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
//                     <label
//                       htmlFor="validationRegx"
//                       className="form-label text-white"
//                     >
//                       Validation Regx
//                     </label>
//                     <input
//                       {...register("validationRegx")}
//                       id="validationRegx"
//                       type="text"
//                       className="form-control form-control-sm color-light-dark bg-silver"
//                       placeholder="Enter Validation Regx"
//                     />
//                   </div>
//                 </div>
//                 <div className="row d-flex justify-content-between mb-3">
//                   <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
//                     <label htmlFor="min" className="form-label text-white">
//                       Min
//                     </label>
//                     <input
//                       {...register("min", { valueAsNumber: true })}
//                       id="min"
//                       type="number"
//                       className="form-control form-control-sm color-light-dark bg-silver"
//                       placeholder="Enter Min"
//                     />
//                   </div>
//                   <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
//                     <label htmlFor="max" className="form-label text-white">
//                       Max
//                     </label>
//                     <input
//                       {...register("max", { valueAsNumber: true })}
//                       id="max"
//                       type="number"
//                       className="form-control form-control-sm color-light-dark bg-silver"
//                       placeholder="Enter Max"
//                     />
//                   </div>
//                   <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
//                     <label
//                       htmlFor="errorMessage"
//                       className="form-label text-white"
//                     >
//                       Error Message
//                     </label>
//                     <input
//                       {...register("errorMessage")}
//                       id="errorMessage"
//                       type="text"
//                       className="form-control form-control-sm color-light-dark bg-silver"
//                       placeholder="Enter Error Message"
//                     />
//                   </div>
//                 </div>
//                 <div className="row d-flex justify-content-start mb-3">
//                   <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
//                     <label htmlFor="sortId" className="form-label text-white">
//                       Sort Id
//                     </label>
//                     <input
//                       {...register("sortId", { valueAsNumber: true })}
//                       id="sortId"
//                       type="number"
//                       className="form-control form-control-sm color-light-dark bg-silver"
//                       placeholder="Enter Sort ID"
//                     />
//                   </div>
//                   <div className="col-lg-4 col-md-6 col-sm-12 text-start">
//                     <label
//                       htmlFor="verificationType"
//                       className="form-label text-white"
//                     >
//                       Verification Type
//                     </label>
//                     <select
//                       {...register("verificationType")}
//                       className="form-select form-select-sm color-light-dark bg-silver"
//                     >
//                       <option value="">None</option>
//                       <option value="image">Image</option>
//                       <option value="video">Video</option>
//                     </select>
//                   </div>
//                   <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
//                     <label
//                       htmlFor="attributeCode"
//                       className="form-label text-white"
//                     >
//                       Attribute Code
//                     </label>
//                     <input
//                       {...register("attributeCode")}
//                       id="attributeCode"
//                       type="text"
//                       className="form-control form-control-sm color-light-dark bg-silver"
//                       placeholder="Enter Attribute Code"
//                     />
//                   </div>
//                 </div>
//                 <div className="row d-flex justify-content-start mb-3">
//                   <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
//                     <label
//                       htmlFor="weightage"
//                       className="form-label text-white"
//                     >
//                       Weightage
//                     </label>
//                     <input
//                       {...register("weightage", { valueAsNumber: true })}
//                       id="weightage"
//                       type="number"
//                       className="form-control form-control-sm color-light-dark bg-silver"
//                       placeholder="Enter Weightage"
//                     />
//                   </div>
//                   <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
//                     <label htmlFor="remarks" className="form-label text-white">
//                       Remarks
//                     </label>
//                     <input
//                       {...register("remarks")}
//                       id="remarks"
//                       type="text"
//                       className="form-control form-control-sm color-light-dark bg-silver"
//                       placeholder="Enter Remarks"
//                     />
//                   </div>
//                 </div>
//                 <div className="row d-flex justify-content-start mb-3">
//                   {watch("attributeType") === "formula" && (
//                     <>
//                       <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
//                         <label
//                           htmlFor="evaluationFormula"
//                           className="form-label text-white"
//                         >
//                           Evaluation Formula
//                         </label>
//                         <input
//                           {...register("evaluationFormula")}
//                           id="evaluationFormula"
//                           type="text"
//                           className="form-control form-control-sm color-light-dark bg-silver"
//                           placeholder="Enter Evaluation Formula"
//                         />
//                       </div>
//                       <div className="col-lg-4 col-md-6 col-sm-12 text-start">
//                         <label
//                           htmlFor="searchAttributeCodes"
//                           className="form-label text-white"
//                         >
//                           Search Attribute Codes
//                         </label>
//                         <select
//                           className="form-select form-select-sm color-light-dark bg-silver"
//                           aria-label="Default select example"
//                           name="searchAttributeCodes"
//                           onChange={handleDatalistSelect}
//                         >
//                           {data.map((d) => (
//                             <option key={d.label} value={d.label}>
//                               {d.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </>
//                   )}
//                 </div>
//                 <div className="row d-flex justify-content-start mb-3">
//                   <div className="col-lg-2 col-md-4 col-sm-12 text-start">
//                     <div className="form-check form-switch">
//                       <label
//                         className="form-check-label text-white"
//                         htmlFor="multiselect"
//                       >
//                         Is Multi Select
//                       </label>
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id="multiselect"
//                         name="multiselect"
//                         checked={isMultiSelect}
//                         onChange={() => setMultiSelect(!isMultiSelect)}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-lg-2 col-md-4 col-sm-12 text-start">
//                     <div className="form-check form-switch">
//                       <label
//                         className="form-check-label text-white"
//                         htmlFor="required"
//                       >
//                         Is Required
//                       </label>
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id="required"
//                         name="required"
//                         checked={isRequired}
//                         onChange={() => setRequired(!isRequired)}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-lg-2 col-md-4 col-sm-12 text-start">
//                     <div className="form-check form-switch">
//                       <label
//                         className="form-check-label text-white"
//                         htmlFor="status"
//                       >
//                         Status
//                       </label>
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id="status"
//                         name="status"
//                         checked={isStatus}
//                         onChange={() => setStatus(!isStatus)}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-lg-2 col-md-4 col-sm-12 text-start">
//                     <div className="form-check form-switch">
//                       <label
//                         className="form-check-label text-white"
//                         htmlFor="hidden"
//                       >
//                         Is Hidden
//                       </label>
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id="hidden"
//                         name="hidden"
//                         checked={isHidden}
//                         onChange={() => setHidden(!isHidden)}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 {watch("attributeType") === "radio" ||
//                 watch("attributeType") === "select" ||
//                 watch("attributeType") === "checkbox" ? (
//                   <>
//                     <div className="row d-flex justify-content-between mb-3">
//                       <div className="col-lg-10 col-md-6 col-sm-4 my-auto">
//                         <h5 className="m-0">Attribute Options</h5>
//                       </div>
//                       <div className="col-lg-2 col-md-6 col-sm-4">
//                         <Button
//                           className="btn bg-color-sea-green text-white"
//                           type="button"
//                           onClick={addNewOption}
//                         >
//                           Add More +
//                         </Button>
//                       </div>
//                     </div>
//                     <hr />
//                     {optionsData.map((option, index) => (
//                       <div
//                         key={index}
//                         className="row d-flex justify-content-between mb-3"
//                       >
//                         <div className="col-lg-3 col-md-6 col-sm-12 mb-3 text-start">
//                           <label
//                             htmlFor={`value-${index}`}
//                             className="form-label text-white"
//                           >
//                             Value
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control form-control-sm color-light-dark bg-silver"
//                             id={`value-${index}`}
//                             name="value"
//                             value={option.value}
//                             onChange={(e) => handleOptionChange(index, e)}
//                             placeholder="Enter Value"
//                           />
//                         </div>
//                         <div className="col-lg-3 col-md-6 col-sm-12 mb-3 text-start">
//                           <label
//                             htmlFor={`label-${index}`}
//                             className="form-label text-white"
//                           >
//                             Label
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control form-control-sm color-light-dark bg-silver"
//                             id={`label-${index}`}
//                             name="label"
//                             value={option.label}
//                             onChange={(e) => handleOptionChange(index, e)}
//                             placeholder="Enter Label"
//                           />
//                         </div>
//                         <div className="col-lg-2 col-md-6 col-sm-12 mb-3 text-start">
//                           <label
//                             htmlFor="sortId"
//                             className="form-label text-white"
//                           >
//                             Sort Id
//                           </label>
//                           <input
//                             type="number"
//                             className="form-control form-control-sm color-light-dark bg-silver"
//                             id="sortId"
//                             name="sortId"
//                             value={option.sortId}
//                             onChange={(e) => handleOptionChange(index, e)}
//                             placeholder="Enter sortId value"
//                           />
//                         </div>
//                         <div className="col-lg-2 col-md-4 col-sm-12 text-start">
//                           <div className="form-check form-switch">
//                             <label
//                               className="form-check-label text-white"
//                               htmlFor={`isActive${index}`}
//                             >
//                               Is Active
//                             </label>
//                             <input
//                               className="form-check-input"
//                               type="checkbox"
//                               id={`isActive${index}`}
//                               name="isActive"
//                               checked={activeStates[index] || false}
//                               onChange={() => handleCheckboxChange(index)}
//                             />
//                           </div>
//                         </div>
//                         <div className="col-lg-2 col-md-6 col-sm-4 mx-auto">
//                           <Button
//                             className="btn btn-danger text-white w-100"
//                             type="button"
//                             onClick={() => handleDeleteOption(index)}
//                           >
//                             Delete
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </>
//                 ) : (
//                   ""
//                 )}
//                 <div className="col-lg-4 col-md-6 col-sm-4 mx-auto">
//                   <Button
//                     className="btn bg-color-sea-green text-white w-100"
//                     type="submit"
//                   >
//                     Done
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default Form;
