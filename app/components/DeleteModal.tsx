import Image from "next/image";
import trashImage from "../../public/images/trash.png";
import trashIcon from "../../public/icons/trash.svg";

interface Props {
  handleDelete: (id: number) => void;
  id: number;
}

const DeleteModal = ({ handleDelete, id }: Props) => {
  const modalId = `deleteModal-${id}`; // Unique modal ID

  return (
    <>
      <button
        type="button"
        className="btn btn-sm rounded-pill"
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`}
      >
        <Image src={trashIcon} alt="trash" />
      </button>

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
                    "linear-gradient(to left, #969696 ,#e3e3e3 )",
                  borderRadius: "20px",
                }}
              >
                <div className="row flex-column justify-content-center mb-4">
                  <div className="col text-center mt-4">
                    <Image src={trashImage} alt="trash" width={110} />
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
                      <div className="col-lg-6 col-md-6 col-sm-12 text-end">
                        <button
                          className="btn btn-outline-light w-50 p-3 fs-5"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 text-start">
                        <button
                          onClick={() => handleDelete(id)}
                          className="btn btn-danger w-50 p-3 fs-5"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          Delete
                        </button>
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
