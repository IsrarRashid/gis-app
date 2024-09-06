import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import Cookies from "js-cookie";
import Select, { ActionMeta, MultiValue } from "react-select";
import { attributeGroupsToProjectMappingAPI } from "@/app/APIs";
import { ToastContainer, toast } from "react-toastify";

export interface Option {
  id: number;
  name: string;
}

interface GroupingFormProps {
  projectId: number;
  groupOptions: Option[];
}

const GroupingForm: React.FC<GroupingFormProps> = ({
  projectId,
  groupOptions,
}) => {
  const [selectedGroups, setSelectedGroups] = useState<Option[]>([]);
  const modalId = `groupModal-${projectId}`; // Unique modal ID
  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);

  const handleShow = async () => {
    setShow(true);
    setRefresh(!refresh);
  };
  const handleClose = () => setShow(false);

  // Fetch previously selected groups
  useEffect(() => {
    const fetchSelectedGroups = async () => {
      const token = Cookies.get("token");

      try {
        const response = await axios.get(
          `${attributeGroupsToProjectMappingAPI}/${0}?projectId=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data.data; // Assuming this returns an array of group objects
        setSelectedGroups(data); // Set the selected groups as objects
      } catch (error) {
        console.error("Error fetching selected groups:", error);
      }
    };

    fetchSelectedGroups();
  }, [projectId, refresh]);

  const handleSelectGroup = (
    newValue: MultiValue<{ value: number; label: string }>,
    actionMeta: ActionMeta<{ value: number; label: string }>
  ) => {
    // Map selected groups to the original format (GroupOption)
    const selectedOptions = newValue
      ? newValue.map((option) => ({
          id: option.value,
          name: option.label,
        }))
      : [];

    setSelectedGroups(selectedOptions);
  };

  const updated = "Updated Successfully";
  const errorMessage = "Something Bad Happend";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const groupsIds = selectedGroups.map((group) => group.id);

    const data = {
      projectID: projectId,
      groupsIds: groupsIds,
    };

    const token = Cookies.get("token");

    try {
      const response = await axios.post(
        attributeGroupsToProjectMappingAPI,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      notifyCreate(updated);
      console.log(response);
      handleClose();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Prepare options for react-select in {value, label} format
  const options = groupOptions.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  // Prepare selected values for react-select in {value, label} format
  const selectedValues = selectedGroups.map((group) => ({
    value: group.id,
    label: group.name,
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
          className="btn btn-sm rounded-pill"
          data-bs-target={`#${modalId}`}
        >
          Attribute Groups
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
                    options={options} // Correctly mapped options
                    value={selectedValues} // Correctly mapped selected values
                    onChange={handleSelectGroup} // Correct handler
                    styles={customStyles}
                    closeMenuOnSelect={false}
                    placeholder="Choose groups..."
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
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
