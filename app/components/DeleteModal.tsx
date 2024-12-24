import Image from "next/image";
import trashIcon from "../../public/icons/trash.svg";
import trashImage from "../../public/images/trash.png";
import Button from "./Button";

interface Props {
  handleDelete: (id: number) => void;
  id: number;
}

const DeleteModal = ({ handleDelete, id }: Props) => {
  const modalId = `deleteModal-${id}`; // Unique modal ID
  return (
    <>
      <Button
        type="button"
        className="btn btn-sm rounded-pill"
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
      >
        <Image src={trashIcon} alt="trash" width={20} height={20} />
      </Button>

      <div
        className="modal fade"
        id={modalId}
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div
            className="modal-content border-0"
            style={{ background: "rgba(255,255,255,0)" }}
          >
            <div className="modal-body p-0">
              <div
                className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6) ,rgba(255, 255, 255, 0.08))",
                  borderRadius: "15px",
                  border: "1.7px solid rgba(255, 255, 255, 0.6)",
                }}
              >
                <div className="row flex-column justify-content-center mb-4">
                  <div className="col text-center mt-4">
                    <Image
                      src={trashImage}
                      alt="trash"
                      width={110}
                      height={110}
                    />
                  </div>
                  <div className="col-lg-9 mx-auto text-center">
                    <p className="text-white mt-2 fs-1 fw-bold">
                      Are you sure you want to delete this record?
                    </p>
                  </div>
                  {/* <div className="col text-center mb-4">
                    <p className="text-white fs-4">Infrastructure</p>
                  </div> */}
                  <div className="col">
                    <div className="row d-flex">
                      <div
                        className="col-lg-6 col-md-6 col-sm-12 text-end"
                        style={{
                          boxSizing: "border-box",
                        }}
                      >
                        <Button
                          className="btn shadow btn-outline-light w-50 p-3 fs-5"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          style={{
                            borderRadius: "12px",
                            boxSizing: "border-box",
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                        <Button
                          onClick={() => handleDelete(id)}
                          className="btn shadow border-0 text-white w-50 p-3 fs-5"
                          style={{
                            backgroundImage:
                              "linear-gradient(to bottom, #DF1130 ,#A50223)",
                            borderRadius: "12px",
                            boxSizing: "border-box",
                          }}
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
