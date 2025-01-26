import Button from "@/app/components/Button";
import apiClient, { AxiosError } from "@/app/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import more from "../../../public/icons/more.svg";

const schema = z.object({
  rightId: z.number().optional().default(0),
  rightName: z.string().min(1, { message: "Please add Right Name!" }),
  rightIdentifier: z.string().optional().default(""),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updatedAt: z.string().optional().default(new Date().toISOString()),
});

type Right = z.infer<typeof schema>;

interface Props {
  api: string;
  method: "POST" | "PUT" | "PATCH";
  id?: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}

const Form = ({ api, method, id, setRefresh, refresh }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Right>({ resolver: zodResolver(schema) });
  // console.log(errors);
  const modalId = `formModal-${id}`;
  const createdMessage = "Created Successfully";
  const updatedMessage = "Updated Successfully";

  const handleClose = () => {
    setShow(false);
    reset();
  };
  const [show, setShow] = useState(false);

  const handleShow = async () => {
    setShow(true);

    if (method === "PUT") {
      try {
        const response = await apiClient.get(api);
        const itemData = response.data.data;
        const data = itemData.find((item: any) => item.rightId === id);
        setValue("rightId", data.rightId);
        setValue("rightName", data.rightName);
        setValue("rightIdentifier", data.rightIdentifier);
        setValue("createdAt", data.createdAt);
        setValue("updatedAt", new Date().toISOString());
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onSubmit = async (formData: Right) => {
    console.log("Form Data:", formData);
    console.log(errors);
    try {
      const response = await apiClient({
        method: method,
        url: api,
        data: formData,
      });
      console.log("Response:", response);
      setRefresh((prev) => !prev);
      toast.success(method === "POST" ? createdMessage : updatedMessage);
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error((err as AxiosError).message);
    }
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <Button
        type="button"
        className={`btn shadow ${
          method === "POST"
            ? "text-white bg-color-sea-green"
            : "rounded-pill ps-3 pe-3 pt-1 pb-1"
        }`}
        onClick={handleShow}
        style={{
          background: method === "POST" ? "" : "rgba(255, 255, 255,.5)",
        }}
      >
        {method === "POST" ? (
          "+ Right"
        ) : (
          <Image src={more} alt="more" width={25} height={25} />
        )}
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
                <p
                  className="text-center text-white mt-4"
                  style={{ fontSize: "1.5rem", fontWeight: "800" }}
                >
                  {method === "POST" ? "ADD RIGHT" : "UPDATE RIGHT"}
                </p>
              </div>
              <form className="ps-5 pe-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="col mb-3">
                  <div className="row d-flex justify-content-between">
                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3 text-start">
                      <label
                        htmlFor="rightName"
                        className="form-label text-white"
                      >
                        Right Name
                      </label>
                      <input
                        {...register("rightName")}
                        id="rightName"
                        type="text"
                        className="form-control form-control-sm color-light-dark"
                        placeholder="Enter Right Name"
                      />
                      {errors.rightName && (
                        <p className="text-danger mt-1">
                          {errors.rightName.message}
                        </p>
                      )}
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3 text-start">
                      <label
                        htmlFor="rightIdentifier"
                        className="form-label text-white"
                      >
                        Right Identifier
                      </label>
                      <input
                        {...register("rightIdentifier")}
                        id="rightIdentifier"
                        type="text"
                        className="form-control form-control-sm color-light-dark"
                        placeholder="Enter Right Identifier"
                      />
                    </div>
                  </div>
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
      </Modal>
    </>
  );
};

export default Form;
