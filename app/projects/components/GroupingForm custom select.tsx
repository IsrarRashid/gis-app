import { attributeGroupsToProjectMappingAPI } from "@/app/APIs";
import axios from "axios";
import React, { useState, FormEvent, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";

export interface GroupOption {
  id: number;
  name: string;
}

interface GroupingFormProps {
  projectId: number;
  groupOptions: GroupOption[];
}

const GroupingForm: React.FC<GroupingFormProps> = ({
  projectId,
  groupOptions,
}) => {
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const modalId = `groupModal-${projectId}`; // Unique modal ID
  const [refresh, setRefresh] = useState(false);

  const updated = "Attribute Group Updated Successfully";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

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
          `${attributeGroupsToProjectMappingAPI}/${1}?projectId=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.data.data;
        // Assuming API response contains selected group IDs array in `data`
        const selectedGroupIds = response.data.data.map(
          (group: any) => group.id
        );

        // Set the state with the group IDs from the response
        setSelectedGroups(selectedGroupIds);
        console.log("fetched groupsIds", data);
      } catch (error) {
        console.error("Error fetching selected groups:", error);
      }
    };

    fetchSelectedGroups();
  }, [projectId, refresh]);

  // Type the event parameter
  const handleSelectGroup = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(e.target.value, 10);
    if (!selectedGroups.includes(selectedValue)) {
      setSelectedGroups([...selectedGroups, selectedValue]);
    }
  };

  // Type the groupId parameter
  const handleRemoveGroup = (groupId: number) => {
    setSelectedGroups(selectedGroups.filter((id) => id !== groupId));
  };

  // Handle form submission with proper typing
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      projectID: projectId,
      groupsIds: selectedGroups,
    };
    const token = Cookies.get("token");

    console.log("submit data: ", data);
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
    } catch (error) {
      console.error("Error submitting data:", error);
    }
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
                      <label
                        htmlFor="groupSelect"
                        className="form-label fw-bold fs-5"
                      >
                        Select Attribute Groups
                      </label>
                    </div>

                    <div className="col-2 text-end">
                      <button
                        className="btn fs-5 fw-bold"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        X
                      </button>
                    </div>
                  </div>

                  <select
                    id="groupSelect"
                    className="form-select"
                    onChange={handleSelectGroup}
                  >
                    <option value="">Choose a Group...</option>
                    {groupOptions.map((group) => {
                      const isSelected = selectedGroups.includes(group.id);
                      return (
                        <option
                          key={group.id}
                          value={group.id}
                          className={
                            isSelected ? "text-white bg-color-sea-green" : ""
                          }
                        >
                          {group.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="mb-3">
                  {selectedGroups.length > 0 && (
                    <div className="selected-groups">
                      {selectedGroups.map((groupId) => (
                        <>
                          <div
                            key={groupId}
                            className="selected-group fs-6 badge mb-2 text-white bg-color-sea-green text-wrap"
                          >
                            {
                              groupOptions.find((group) => group.id === groupId)
                                ?.name
                            }
                            <button
                              type="button"
                              className="btn-close ms-2"
                              aria-label="Close"
                              onClick={() => handleRemoveGroup(groupId)}
                            ></button>
                          </div>
                          &nbsp; &nbsp;
                        </>
                      ))}
                    </div>
                  )}
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
