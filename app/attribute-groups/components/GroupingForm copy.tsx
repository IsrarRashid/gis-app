import { ATTRIBUTE_GROUP_MAPPING_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import axios from "axios";
import Cookies from "js-cookie";
import React, { FormEvent, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

export interface Attributes {
  attributeId: number;
  label: string;
}

interface GroupingFormProps {
  groupId: number;
  attributeOptions: Attributes[];
}

const GroupingForm: React.FC<GroupingFormProps> = ({
  groupId,
  attributeOptions,
}) => {
  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const modalId = `attributeModal-${groupId}`; // Unique modal ID
  const [refresh, setRefresh] = useState(false);
  const [show, setShow] = useState(false);

  const updated = "Attributes Updated Successfully";

  const notifyCreate = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  const handleShow = async () => {
    setShow(true);
    setRefresh(!refresh);
  };
  const handleClose = () => setShow(false);

  // Fetch previously selected groups
  useEffect(() => {
    const fetchSelectedAttributes = async () => {
      const token = Cookies.get("token");

      try {
        const response = await axios.get(
          `${ATTRIBUTE_GROUP_MAPPING_API}/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.data.data;
        // Assuming API response contains selected group IDs array in `data`
        const selectedAttributeIds = response.data.data.map(
          (attribute: any) => attribute.attributeId
        );

        // Set the state with the group IDs from the response
        setSelectedAttributes(selectedAttributeIds);
        console.log("fetched attributeIds", data);
      } catch (error) {
        console.error("Error fetching selected groups:", error);
      }
    };

    fetchSelectedAttributes();
  }, [groupId, refresh]);

  // Type the event parameter
  const handleSelectGroup = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(e.target.value, 10);
    if (!selectedAttributes.includes(selectedValue)) {
      setSelectedAttributes([...selectedAttributes, selectedValue]);
    }
  };

  // Type the groupId parameter
  const handleRemoveGroup = (groupId: number) => {
    setSelectedAttributes(selectedAttributes.filter((id) => id !== groupId));
  };

  // Handle form submission with proper typing
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      groupId: groupId,
      attributeIds: selectedAttributes,
    };
    const token = Cookies.get("token");

    console.log("submit data: ", data);
    try {
      const response = await axios.post(ATTRIBUTE_GROUP_MAPPING_API, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      notifyCreate(updated);
      console.log(response);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <>
      <div>
        <Button
          type="button"
          onClick={handleShow}
          className="btn btn-sm text-white bg-color-sea-green"
          data-bs-target={`#${modalId}`}
        >
          Attributes
        </Button>

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
                        Select Attributes
                      </label>
                    </div>

                    <div className="col-2 text-end">
                      <Button
                        className="btn fs-5 fw-bold"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        X
                      </Button>
                    </div>
                  </div>

                  <select
                    id="groupSelect"
                    className="form-select"
                    onChange={handleSelectGroup}
                  >
                    <option value="">Choose a Attribute...</option>
                    {attributeOptions.map((group) => (
                      <option key={group.attributeId} value={group.attributeId}>
                        {group.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  {selectedAttributes.length > 0 && (
                    <div className="selected-groups">
                      {selectedAttributes.map((groupId) => (
                        <>
                          <div
                            key={groupId}
                            className="selected-group fs-6 badge mb-2 text-white bg-color-sea-green text-wrap"
                          >
                            {
                              attributeOptions.find(
                                (group) => group.attributeId === groupId
                              )?.label
                            }
                            <Button
                              type="button"
                              className="btn-close ms-2"
                              aria-label="Close"
                              onClick={() => handleRemoveGroup(groupId)}
                            ></Button>
                          </div>
                          &nbsp; &nbsp;
                        </>
                      ))}
                    </div>
                  )}
                </div>
                <div className="col text-center">
                  <Button
                    type="submit"
                    className="btn text-white bg-color-sea-green"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default GroupingForm;
