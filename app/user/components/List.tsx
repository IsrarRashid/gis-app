"use client";
import Image from "next/image";
import calender from "../../../public/icons/calendar.svg";
import trash from "../../../public/icons/trash.svg";
import more from "../../../public/icons/more.svg";
import clock from "../../../public/icons/clock.svg";
import cancel from "../../../public/icons/cancel.svg";
import complete from "../../../public/icons/complete.svg";
import arrowLeft from "../../../public/icons/arrow-left.svg";
import arrowRight from "../../../public/icons/arrow-right.svg";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import DeleteModal from "@/app/components/DeleteModal";
import { userAPI } from "@/app/APIs";
import Form from "./Form";

interface Props {
  id: number;
  name: string;
  email: string;
  phone: string;
  roleId: number;
  password: string;
  createdAt: string;
  updatedAt: string;
}

interface ListProps {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const List = ({ refresh, setRefresh }: ListProps) => {
  const [data, setData] = useState<Props[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const response = await axios.get(userAPI, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setData(response.data.data);
        }
        console.log("api Data:", data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    loadItems();
  }, [refresh]);

  useEffect(() => {
    console.log("new data:", data);
  }, [data]);

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get("token");
      if (token) {
        await axios.delete(`${userAPI}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        // remove the deleted item from the data array
        setData((prevData) => prevData.filter((item) => item.id !== id));
        // notifyCreate(deleteMessage);
        console.log("item deleted successfully");
      }
    } catch (error) {
      console.error("failed to delete item", error);
      // notifyError(errorMessage);
    }
  };

  return (
    <div className="table-responsive ">
      <table className="table mb-5" style={{ border: ".5px solid #858585" }}>
        <thead>
          <tr
            className="color-dark-blue"
            style={{ border: "1px solid #858585 !important" }}
          >
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>PHONE</th>
            <th>ROLE ID</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.email}</td>
              <td>{d.phone}</td>
              <td>{d.roleId}</td>
              <td>
                <div className="row d-flex">
                  <div className="col">
                    <DeleteModal handleDelete={handleDelete} id={d.id} />
                  </div>
                  <div className="col">
                    <Form
                      api={userAPI}
                      method="PUT"
                      id={d.id}
                      setRefresh={setRefresh}
                      refresh={refresh}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="row d-flex">
        <div className="col-lg-6 col-md-6 col-sm-12">1 - 11 of 50</div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="row d-flex justify-content-end">
            <div className="col-lg-2 col-md-1 col-sm-12"></div>
            <div className="col-lg-5 col-md-7 col-sm-12 d-flex justify-content-end mb-2">
              Rows per page:
              <div className="dropdown ms-2">
                <button
                  className="btn btn-sm dropdown-toggle bg-color-sea-green text-white"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  11
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-12 text-end">
              <button className="btn btn-sm bg-color-sea-green shadow-sm me-2">
                <Image src={arrowLeft} alt="arrow left" />
              </button>
              <button className="btn btn-sm bg-color-sea-green shadow-sm">
                <Image src={arrowRight} alt="arrow right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
