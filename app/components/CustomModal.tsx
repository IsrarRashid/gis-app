import { ReactNode, useState } from "react";
import { Modal } from "react-bootstrap";

interface Props {
  button: ReactNode;
  body: ReactNode;
  modalId: string;
  size?: "sm" | "lg" | "xl";
  isFullscreen?: true | false;
  allowOpen?: true | false;
  HeaderRightPos?: number;
  HeaderTopPos?: number;
  showCloseButton?: true | false;
}

const CustomModal = ({
  button,
  body,
  modalId,
  size,
  isFullscreen = false,
  allowOpen = true,
  HeaderRightPos = 35,
  HeaderTopPos = 35,
  showCloseButton = true,
}: Props) => {
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  const handleShow = async () => {
    if (allowOpen) setShow(true);
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
        aria-labelledby="position-relative contained-modal-title-vcenter"
        centered
        dialogClassName="custom-modal"
        fullscreen={isFullscreen ? true : undefined}
      >
        {showCloseButton && (
          <Modal.Header
            closeButton
            className="border-0 position-absolute"
            style={{
              marginTop: "0px",
              right: HeaderRightPos,
              zIndex: 2,
              top: HeaderTopPos,
            }}
          ></Modal.Header>
        )}

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
