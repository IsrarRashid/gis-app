import Modal from "react-bootstrap/Modal";
import plus from "../../../public/icons/plus.svg";
import minus from "../../../public/icons/minus.svg";
import Image from "next/image";
import { FormEvent, useState } from "react";
import more from "../../../public/icons/more.svg";
import { ToastContainer, toast } from "react-toastify";
import apiClient, { AxiosError } from "@/app/services/api-client";
import useSectors, { Sector } from "@/app/hooks/useSectors";
import Button from "@/app/components/Button";

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}

const SectorForm = ({ api, method, id, setRefresh, refresh }: Props) => {
  const { data, setError } = useSectors({ refresh });
  const [formData, setFormData] = useState<Sector>({
    id: 0,
    parentId: 0,
    name: "",
    description: "",
    createdAt: new Date().toISOString(),
    updateAt: new Date().toISOString(),
    sortId: 0,
  });
  const modalId = `formModal-${id}`;
  const [show, setShow] = useState(false);

  // messages
  const created = "Created Successfully";
  const updated = "Updated Successfully";
  const nameError = "Please Add Name!";
  const sortIdError = "Please Add Sort Id!";

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
          id: itemData.id,
          parentId: itemData.parentId,
          name: itemData.name,
          description: itemData.description,
          sortId: itemData.sortId,
          createdAt: new Date().toISOString(),
          updateAt: new Date().toISOString(),
        });
      } catch (err) {
        console.log((err as AxiosError).message);
        notifyError((err as AxiosError).message);
        setError((err as AxiosError).message);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    switch (true) {
      case !formData.name:
        notifyError(nameError);
        break;

      case !formData.sortId:
        notifyError(sortIdError);
        break;

      default:
        try {
          // send a POST request to the server to add the product
          if (method === "POST") {
            const response = await apiClient({
              method: method,
              url: api,
              data: formData,
            });
            notifyCreate(created);
            setFormData({
              id: 0,
              parentId: 0,
              name: "",
              description: "",
              createdAt: new Date().toISOString(),
              updateAt: new Date().toISOString(),
              sortId: 0,
            });
            console.log("response", response);
            setRefresh((prev) => !prev);
          } else {
            const response = await apiClient({
              method: method,
              url: `${api}/${id}`,
              data: formData,
            });
            console.log("response", response);
            notifyCreate(updated);
            setRefresh((prev) => !prev);
          }
          // handle the response and perform any necessary actions
          console.log("data", formData);
        } catch (err) {
          console.log((err as AxiosError).message);
          notifyError((err as AxiosError).message);
          setError((err as AxiosError).message);
        }
    }
  };

  return (
    <>
      {method === "POST" ? (
        <Button
          type="button"
          className="btn btn-sm text-white bg-color-sea-green"
          onClick={handleShow}
        >
          + Sector
        </Button>
      ) : (
        <Button
          className="btn btn-sm rounded-pill"
          style={{ background: "#fff" }}
          onClick={handleShow}
        >
          <Image src={more} alt="more" />
        </Button>
      )}

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
            className="container-fluid pt-3 pb-3 ps-4 pe-4"
            style={{
              backgroundImage:
                "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6) ,rgba(255, 255, 255, 0.08))",
              borderRadius: "15px",
              border: "1.7px solid rgba(255, 255, 255, 0.6)",
            }}
          >
            <div className="row flex-column justify-content-center mb-4">
              <div className="col-lg-12">
                {method === "POST" ? (
                  <p
                    className="text-center text-white mt-4"
                    style={{ fontSize: "1.5rem", fontWeight: "800" }}
                  >
                    <span>ADD SECTOR</span>
                  </p>
                ) : (
                  <p
                    className="text-center text-white mt-4"
                    style={{ fontSize: "1.5rem", fontWeight: "800" }}
                  >
                    <span>UPDATE SECTOR</span>
                  </p>
                )}
              </div>
              <form className="ps-5 pe-5" onSubmit={handleSubmit}>
                <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
                  <label htmlFor="name" className="form-label text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm color-light-dark bg-silver"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Sector Name"
                  />
                </div>
                <div className="col mb-3">
                  <div className="row d-flex justify-content-between">
                    <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                      <label
                        htmlFor="parentId"
                        className="form-label text-white"
                      >
                        Parent Sector
                      </label>
                      <select
                        className="form-select form-select-sm color-light-dark bg-silver"
                        aria-label="Default select example"
                        name="parentId"
                        onChange={handleChange}
                      >
                        <option value={0}>None</option>

                        {data.length > 0 ? (
                          data?.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>Loading...</option>
                        )}
                      </select>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 text-start">
                      <label htmlFor="sector" className="form-label text-white">
                        Sort ID
                      </label>
                      <div className="row bg-light d-flex rounded-pill">
                        <div className="col ps-1 pt-1 pb-1">
                          <Button
                            className="btn bg-color-sea-green rounded rounded-pill p-0"
                            type="button"
                            onClick={() => {
                              if (formData.sortId !== 0) {
                                setFormData((prevData) => ({
                                  ...prevData,
                                  sortId: prevData.sortId - 1,
                                }));
                              }
                            }}
                          >
                            <Image
                              className="p-1"
                              src={minus}
                              alt="minus"
                              width={25}
                              height={20}
                            />
                          </Button>
                        </div>
                        <div className="col p-0 d-flex align-items-center justify-content-center">
                          <input
                            type="number"
                            name="sortId"
                            id="sortId"
                            value={formData.sortId}
                            onChange={handleChange}
                            className="form-control form-control-sm color-light-dark bg-silver p-0 sortId text-center border-0 bg-light"
                          />
                        </div>
                        <div className="col text-end pe-1 pt-1 pb-1">
                          <Button
                            className="btn bg-color-sea-green rounded rounded-pill p-0"
                            type="button"
                            onClick={() => {
                              setFormData((prevData) => ({
                                ...prevData,
                                sortId: prevData.sortId + 1,
                              }));
                            }}
                          >
                            <Image
                              src={plus}
                              alt="plus"
                              className="p-1"
                              width={25}
                              height={20}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-start">
                  <label
                    htmlFor="description"
                    className="form-label text-white"
                  >
                    Description
                  </label>
                  <textarea
                    className="form-control form-control-sm color-light-dark bg-silver"
                    value={formData.description}
                    onChange={handleChange}
                    name="description"
                    placeholder="Write Brief Description..."
                    id="description"
                    style={{ height: "100px" }}
                  />
                </div>
                <div className="col-lg-8 col-md-8 col-sm-6 mx-auto">
                  <Button
                    className="btn text-white w-100 border-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, #0C8CE9 ,#136AAA)",
                      borderRadius: "12px",
                    }}
                    type="submit"
                  >
                    Done
                  </Button>
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

export default SectorForm;
