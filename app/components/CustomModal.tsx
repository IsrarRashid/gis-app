import Button from "@/app/components/Button";
import { ReactNode, useState } from "react";
import { Modal } from "react-bootstrap";

interface Props {
  button: ReactNode;
  body: ReactNode;
  modalId: string;
  size?: "sm" | "lg" | "xl";
  isFullscreen?: true | false;
}

const CustomModal = ({
  button,
  body,
  modalId,
  size,
  isFullscreen = false,
}: Props) => {
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  const handleShow = async () => {
    setShow(true);
  };

  return (
    <>
      <div
        data-bs-target={`#${modalId}`}
        onClick={() => {
          handleShow();
        }}
        className="col p-0"
      >
        {button}
      </div>

      <Modal
        size={size}
        id={modalId}
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="custom-modal"
        fullscreen={isFullscreen ? true : undefined}
      >
        <Modal.Body
          className="p-0"
          style={{ background: "rgba(156,255,255,0)" }}
        >
          {body}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomModal;
