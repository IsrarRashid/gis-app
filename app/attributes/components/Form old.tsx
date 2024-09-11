import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import more from "../../../public/icons/more.svg";
import { ToastContainer, toast } from "react-toastify";
import useAttributes from "@/app/hooks/useAttributes";
import apiClient, { AxiosError } from "@/app/services/api-client";

interface Form {
  attributeId: 0;
  attributeDataType: string;
  multiselect: number;
  label: string;
  validationRegx: string;
  min: number;
  max: number;
  required: number;
  status: number;
  hidden: number;
  createdAt: string;
  updatedAt: string;
  placeholder: string;
  attributeType: string;
  unit: string;
  errorMessage: string;
  verificationType: string;
  sortId: number;
  attributeCode: string;
  evaluationFormula: string;
  weightage: number;
  remarks: string;
}

interface Option {
  value: string;
  attributeId: number;
  sortId: number;
  isActive: number;
  label: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}

const Form = ({ api, method, id, setRefresh, refresh }: Props) => {
  const { data, setError } = useAttributes({ refresh });
  const [isRequired, setRequired] = useState(false);
  const [isMultiSelect, setMultiSelect] = useState(false);
  const [isStatus, setStatus] = useState(false);
  const [isHidden, setHidden] = useState(false);
  const [activeStates, setActiveStates] = useState<{ [key: number]: boolean }>(
    {}
  );
  const modalId = `formModal-${id}`;
  const handleCheckboxChange = (index: number) => {
    setActiveStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };

  const handleDeleteOption = (index: number) => {
    setOptionsData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const [formData, setFormData] = useState<Form>({
    attributeId: 0,
    attributeDataType: "",
    multiselect: 0,
    label: "",
    validationRegx: "",
    min: 0,
    max: 0,
    required: 0,
    status: 0,
    hidden: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    placeholder: "",
    attributeType: "",
    unit: "",
    errorMessage: "",
    verificationType: "",
    sortId: 0,
    attributeCode: "",
    evaluationFormula: "",
    weightage: 0,
    remarks: "",
  });

  const [optionsData, setOptionsData] = useState<Option[]>([
    {
      attributeId: 0,
      value: "",
      sortId: 0,
      isActive: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      label: "",
    },
  ]);

  const [show, setShow] = useState(false);
  // error messages
  const errorMessages = {
    created: "Created Successfully",
    labelError: "Please add Label!",
    attributeDataTypeError: "Please add Attribute DataType!",
  };
  const updated = "Updated Successfully";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  const handleClose = () => setShow(false);
  const handleShow = async () => {
    setShow(true);

    if (method === "PUT") {
      try {
        // send a POST request to the server to add the product
        const response = await apiClient.get(`${api}/${id}`);
        const itemData = response.data.data;
        setFormData({
          attributeId: itemData.attributeId,
          attributeDataType: itemData.attributeDataType,
          multiselect: itemData.multiselect,
          label: itemData.label,
          validationRegx: itemData.validationRegx,
          min: itemData.min,
          max: itemData.max,
          required: itemData.required,
          status: itemData.status,
          hidden: itemData.hidden,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          placeholder: itemData.placeholder,
          attributeType: itemData.attributeType,
          unit: itemData.unit,
          errorMessage: itemData.errorMessage,
          verificationType: itemData.verificationType,
          sortId: itemData.sortId,
          attributeCode: itemData.attributeCode,
          evaluationFormula: itemData.evaluationFormula,
          weightage: itemData.weightage,
          remarks: itemData.remarks,
        });
        setRequired(itemData.required === 1 ? true : false);
        setMultiSelect(itemData.multiselect === 1 ? true : false);
        setStatus(itemData.status === 1 ? true : false);
        setHidden(itemData.hidden === 1 ? true : false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleDatalistSelect = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      // Trim the existing and new values and join them with a single space
      evaluationFormula: prevData.evaluationFormula
        ? `${prevData.evaluationFormula.trim()}${e.target.value.trim()}`
        : e.target.value.trim(),
    }));
  };

  const handleOptionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setOptionsData((prevOptions) =>
      prevOptions.map((option, i) =>
        i === index ? { ...option, [name]: value } : option
      )
    );
  };

  // Function to handle adding new option
  const addNewOption = () => {
    setOptionsData((prevOptions) => [
      ...prevOptions,
      {
        value: "",
        attributeId: 0,
        sortId: 0,
        isActive: 0,
        label: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

  useEffect(() => {
    setFormData({
      ...formData,
      evaluationFormula:
        formData.attributeType === "formula"
          ? formData.evaluationFormula
          : (formData.evaluationFormula = ""),
      required: isRequired ? 1 : 0,
      multiselect: isMultiSelect ? 1 : 0,
      status: isStatus ? 1 : 0,
      hidden: isHidden ? 1 : 0,
    });
  }, [
    isRequired,
    isMultiSelect,
    isStatus,
    isHidden,
    formData.attributeType,
    formData,
  ]);

  // Update optionsData state when activeStates change
  useEffect(() => {
    setOptionsData((prevOptions) =>
      prevOptions.map((option, i) => ({
        ...option,
        isActive: activeStates[i] === true ? 1 : 0,
      }))
    );
  }, [activeStates]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    switch (true) {
      case !formData.label:
        notifyError(errorMessages.labelError);
        break;

      case !formData.attributeDataType:
        notifyError(errorMessages.attributeDataTypeError);
        break;

      default:
        try {
          console.log("data:", { attribute: formData, options: optionsData });
          // send a POST request to the server to add the product
          if (method === "POST") {
            const response = await apiClient({
              method: method,
              url: api,
              data: {
                attribute: formData,
                options:
                  formData.attributeType === "radio" ||
                  formData.attributeType === "select" ||
                  formData.attributeType === "checkbox"
                    ? optionsData
                    : null,
              },
            });
            // notifyCreate(errorMessages.created);
            handleClose();
            setFormData({
              attributeId: 0,
              attributeDataType: "",
              multiselect: 0,
              label: "",
              validationRegx: "",
              min: 0,
              max: 0,
              required: 0,
              status: 0,
              hidden: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              placeholder: "",
              attributeType: "",
              unit: "",
              errorMessage: "",
              verificationType: "",
              sortId: 0,
              attributeCode: "",
              evaluationFormula: "",
              weightage: 0,
              remarks: "",
            });
            console.log("Submit Response:", response.data);
            setRefresh((prev) => !prev);
          } else {
            const response = await apiClient({
              method: method,
              url: `${api}/${id}`,
              data: formData,
            });
            console.log("response", response);
            setRefresh((prev) => !prev);
            // notifyCreate(updated);
          }
        } catch (err) {
          console.log((err as AxiosError).message);
          // notifyError((err as AxiosError).message);
          setError((err as AxiosError).message);
        }
    }
  };

  return (
    <>
      {method === "POST" ? (
        <button
          type="button"
          className="btn btn-sm text-white bg-color-sea-green"
          onClick={handleShow}
        >
          + Attribute
        </button>
      ) : (
        <button
          className="btn btn-sm rounded-pill"
          style={{ background: "#fff" }}
          onClick={handleShow}
        >
          <Image src={more} alt="more" />
        </button>
      )}

      <Modal
        size="xl"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="custom-modal"
        id={modalId}
      >
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          <div
            className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
            style={{
              backgroundImage: "linear-gradient(to left, #969696 ,#d9d9d9)",
              borderRadius: "20px",
            }}
          >
            <div className="row flex-column justify-content-center mb-4">
              <div className="col-lg-12">
                {method === "POST" ? (
                  <p className="text-center text-white mt-4 fw-bold">
                    <span>ADD Attribute</span>
                  </p>
                ) : (
                  <p className="text-center text-white mt-4 fw-bold">
                    <span>UPDATE Attribute</span>
                  </p>
                )}
              </div>
              <form
                className="ps-lg-4 pe-lg-4 ps-md-4 pe-md-4"
                onSubmit={handleSubmit}
              >
                <div className="row d-flex justify-content-between mb-3">
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="label" className="form-label text-white">
                      Label
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="label"
                      name="label"
                      value={formData.label}
                      onChange={handleChange}
                      placeholder="Enter Label"
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="placeholder"
                      className="form-label text-white"
                    >
                      Placeholder
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="placeholder"
                      name="placeholder"
                      value={formData.placeholder}
                      onChange={handleChange}
                      placeholder="Enter Placeholder"
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 text-start">
                    <label
                      htmlFor="attributeDataType"
                      className="form-label text-white"
                    >
                      Attribute DataType
                    </label>
                    <select
                      className="form-select form-select-sm"
                      aria-label="Default select example"
                      name="attributeDataType"
                      onChange={handleChange}
                      value={formData.attributeDataType}
                    >
                      <option value="">None</option>
                      <option value="number">Number</option>
                      <option value="string">String</option>
                      <option value="date">Date</option>
                    </select>
                  </div>
                </div>
                <div className="row d-flex justify-content-between mb-3">
                  <div className="col-lg-4 col-md-6 col-sm-12 text-start">
                    <label
                      htmlFor="attributeType"
                      className="form-label text-white"
                    >
                      Attribute Type
                    </label>
                    <select
                      className="form-select form-select-sm"
                      aria-label="Default select example"
                      name="attributeType"
                      onChange={handleChange}
                      value={formData.attributeType}
                    >
                      <option value="">None</option>
                      <option value="text">Text</option>
                      <option value="select">Select</option>
                      <option value="file">File</option>
                      <option value="radio">Radio</option>
                      <option value="slider">Slider</option>
                      <option value="textarea">Textarea</option>
                      <option value="progress">Progress</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="formula">Formula</option>
                    </select>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="unit" className="form-label text-white">
                      Unit
                    </label>
                    <input
                      type="string"
                      className="form-control form-control-sm"
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      placeholder="Enter Unit"
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="validationRegx"
                      className="form-label text-white"
                    >
                      Validation Regx
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="validationRegx"
                      name="validationRegx"
                      value={formData.validationRegx}
                      onChange={handleChange}
                      placeholder="Enter Validation Regx"
                    />
                  </div>
                </div>
                <div className="row d-flex justify-content-between mb-3">
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="min" className="form-label text-white">
                      Min
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      id="min"
                      name="min"
                      value={formData.min}
                      onChange={handleChange}
                      placeholder="Enter Min value"
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="max" className="form-label text-white">
                      Max
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      id="max"
                      name="max"
                      value={formData.max}
                      onChange={handleChange}
                      placeholder="Enter Max value"
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="errorMessage"
                      className="form-label text-white"
                    >
                      Error Message
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="errorMessage"
                      name="errorMessage"
                      value={formData.errorMessage}
                      onChange={handleChange}
                      placeholder="Enter Error Message"
                    />
                  </div>
                </div>
                <div className="row d-flex justify-content-start mb-3">
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="sortId" className="form-label text-white">
                      Sort Id
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      id="sortId"
                      name="sortId"
                      value={formData.sortId}
                      onChange={handleChange}
                      placeholder="Enter Sort Id"
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 text-start">
                    <label
                      htmlFor="verificationType"
                      className="form-label text-white"
                    >
                      Verification Type
                    </label>
                    <select
                      className="form-select form-select-sm"
                      aria-label="Default select example"
                      name="verificationType"
                      onChange={handleChange}
                      value={formData.verificationType}
                    >
                      <option value="">None</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="attributeCode"
                      className="form-label text-white"
                    >
                      Attribute Code
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="attributeCode"
                      name="attributeCode"
                      value={formData.attributeCode}
                      onChange={handleChange}
                      placeholder="Enter Verification Content"
                    />
                  </div>
                </div>
                <div className="row d-flex justify-content-start mb-3">
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label
                      htmlFor="weightage"
                      className="form-label text-white"
                    >
                      Weightage
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      id="weightage"
                      name="weightage"
                      value={formData.weightage}
                      onChange={handleChange}
                      placeholder="Enter Verification Content"
                    />
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                    <label htmlFor="remarks" className="form-label text-white">
                      Remarks
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="remarks"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      placeholder="Enter Verification Content"
                    />
                  </div>
                </div>

                <div className="row d-flex justify-content-start mb-3">
                  {formData.attributeType === "formula" && (
                    <>
                      <div className="col-lg-4 col-md-6 col-sm-12 mb-3 text-start">
                        <label
                          htmlFor="evaluationFormula"
                          className="form-label text-white"
                        >
                          Evaluation Formula
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="evaluationFormula"
                          name="evaluationFormula"
                          value={formData.evaluationFormula}
                          onChange={handleChange}
                          placeholder="Enter Evaluation Formula"
                        />
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12 text-start">
                        <label
                          htmlFor="searchAttributeCodes"
                          className="form-label text-white"
                        >
                          Search Attribute Codes
                        </label>
                        <select
                          className="form-select form-select-sm"
                          aria-label="Default select example"
                          name="searchAttributeCodes"
                          onChange={handleDatalistSelect}
                        >
                          {data.map((d) => (
                            <option key={d.label} value={d.label}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
                <div className="row d-flex justify-content-start mb-3">
                  <div className="col-lg-2 col-md-4 col-sm-12 text-start">
                    <div className="form-check form-switch">
                      <label
                        className="form-check-label text-white"
                        htmlFor="multiselect"
                      >
                        Is Multi Select
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="multiselect"
                        name="multiselect"
                        checked={isMultiSelect}
                        onChange={() => setMultiSelect(!isMultiSelect)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-12 text-start">
                    <div className="form-check form-switch">
                      <label
                        className="form-check-label text-white"
                        htmlFor="required"
                      >
                        Is Required
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="required"
                        name="required"
                        checked={isRequired}
                        onChange={() => setRequired(!isRequired)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-12 text-start">
                    <div className="form-check form-switch">
                      <label
                        className="form-check-label text-white"
                        htmlFor="status"
                      >
                        Status
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="status"
                        name="status"
                        checked={isStatus}
                        onChange={() => setStatus(!isStatus)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-12 text-start">
                    <div className="form-check form-switch">
                      <label
                        className="form-check-label text-white"
                        htmlFor="hidden"
                      >
                        Is Hidden
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="hidden"
                        name="hidden"
                        checked={isHidden}
                        onChange={() => setHidden(!isHidden)}
                      />
                    </div>
                  </div>
                </div>
                {formData.attributeType === "radio" ||
                formData.attributeType === "select" ||
                formData.attributeType === "checkbox" ? (
                  <>
                    <div className="row d-flex justify-content-between mb-3">
                      <div className="col-lg-10 col-md-6 col-sm-4 my-auto">
                        <h5 className="m-0">Attribute Options</h5>
                      </div>
                      <div className="col-lg-2 col-md-6 col-sm-4">
                        <button
                          className="btn bg-color-sea-green text-white"
                          type="button"
                          onClick={addNewOption}
                        >
                          Add More +
                        </button>
                      </div>
                    </div>
                    <hr />
                    {optionsData.map((option, index) => (
                      <div
                        key={index}
                        className="row d-flex justify-content-between mb-3"
                      >
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 text-start">
                          <label
                            htmlFor={`value-${index}`}
                            className="form-label text-white"
                          >
                            Value
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id={`value-${index}`}
                            name="value"
                            value={option.value}
                            onChange={(e) => handleOptionChange(index, e)}
                            placeholder="Enter Value"
                          />
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3 text-start">
                          <label
                            htmlFor={`label-${index}`}
                            className="form-label text-white"
                          >
                            Label
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id={`label-${index}`}
                            name="label"
                            value={option.label}
                            onChange={(e) => handleOptionChange(index, e)}
                            placeholder="Enter Label"
                          />
                        </div>
                        <div className="col-lg-2 col-md-6 col-sm-12 mb-3 text-start">
                          <label
                            htmlFor="sortId"
                            className="form-label text-white"
                          >
                            Sort Id
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            id="sortId"
                            name="sortId"
                            value={option.sortId}
                            onChange={(e) => handleOptionChange(index, e)}
                            placeholder="Enter sortId value"
                          />
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-12 text-start">
                          <div className="form-check form-switch">
                            <label
                              className="form-check-label text-white"
                              htmlFor={`isActive${index}`}
                            >
                              Is Active
                            </label>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`isActive${index}`}
                              name="isActive"
                              checked={activeStates[index] || false}
                              onChange={() => handleCheckboxChange(index)}
                            />
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-6 col-sm-4 mx-auto">
                          <button
                            className="btn btn-danger text-white w-100"
                            type="button"
                            onClick={() => handleDeleteOption(index)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  ""
                )}
                <div className="col-lg-4 col-md-6 col-sm-4 mx-auto">
                  <button
                    className="btn bg-color-sea-green text-white w-100"
                    type="submit"
                  >
                    Done
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <ToastContainer />
      </Modal>
    </>
  );
};

export default Form;
