import React, { useState, useEffect, FormEvent } from "react";
import { Modal } from "react-bootstrap";
import Select, { ActionMeta, MultiValue } from "react-select";
import { attributeGroupMappingAPI } from "@/app/APIs";
import { ToastContainer, toast } from "react-toastify";
import { Option } from "./List";
import apiClient from "@/app/services/api-client";

interface Props {
  id: number;
  options: Option[];
}

const GroupingForm = ({ id, options }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const modalId = `groupModal-${id}`; // Unique modal ID
  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);

  const handleShow = async () => {
    setShow(true);
    setRefresh(!refresh);
  };
  const handleClose = () => setShow(false);

  // Fetch previously selected groups
  useEffect(() => {
    const fetchSelectedOptions = async () => {
      try {
        const response = await apiClient.get(
          `${attributeGroupMappingAPI}/${id}`
        );
        const data = response.data.data; // Assuming this returns an array of group objects
        setSelectedOptions(data); // Set the selected groups as objects
      } catch (error) {
        console.error("Error fetching selected groups:", error);
      }
    };

    fetchSelectedOptions();
  }, [id, refresh]);

  const handleSelectGroup = (
    newValue: MultiValue<{ value: number; label: string }>,
    actionMeta: ActionMeta<{ value: number; label: string }>
  ) => {
    // Map selected groups to the original format (GroupOption)
    const selectedOptions = newValue
      ? newValue.map((option) => ({
          attributeId: option.value,
          label: option.label,
        }))
      : [];

    setSelectedOptions(selectedOptions);
  };

  const updated = "Updated Successfully";
  const errorMessage = "Something Bad Happend";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const optionIds = selectedOptions.map((group) => group.attributeId);

    const data = {
      groupId: id,
      attributeIds: optionIds,
    };

    try {
      const response = await apiClient.post(attributeGroupMappingAPI, data);
      // notifyCreate(updated);
      console.log(response);
      handleClose();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Prepare options for react-select in {value, label} format
  const availableOptions = options.map((group) => ({
    value: group.attributeId,
    label: group.label,
  }));

  // Prepare selected values for react-select in {value, label} format
  const selectedValues = selectedOptions.map((group) => ({
    value: group.attributeId,
    label: group.label,
  }));

  // Custom styles for react-select options
  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#B0E0E6" // Light blue for selected options
        : provided.backgroundColor,
      color: state.isSelected ? "#000" : provided.color,
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#B0E0E6", // Light blue for selected values
    }),
  };

  return (
    <>
      <div>
        <button
          type="button"
          onClick={handleShow}
          className="btn btn-sm text-white bg-color-sea-green"
          data-bs-target={`#${modalId}`}
        >
          Attributes
        </button>

        <Modal
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
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <div className="row d-flex">
                    <div className="col">
                      <label htmlFor="groupSelect" className="form-label">
                        Select Groups
                      </label>
                    </div>

                    <div className="col text-end">
                      <button
                        className="btn fs-5 fw-bold"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={handleClose}
                      >
                        X
                      </button>
                    </div>
                  </div>

                  <Select
                    id="groupSelect"
                    isMulti
                    options={availableOptions} // Correctly mapped options
                    value={selectedValues} // Correctly mapped selected values
                    onChange={handleSelectGroup} // Correct handler
                    styles={customStyles}
                    closeMenuOnSelect={false}
                    placeholder="Choose Attributes..."
                  />
                </div>
                <div className="col text-center">
                  <button
                    type="submit"
                    className="btn text-white bg-color-sea-green"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </Modal.Body>
        </Modal>
        <ToastContainer />
      </div>
    </>
  );
};

export default GroupingForm;
