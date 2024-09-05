"use client";
import SectorsTable from "@/app/sectors/components/SectorsTable";
import TopMenu from "@/app/sectors/components/TopMenu";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { sectorAPI } from "@/app/APIs";

interface Props {
  id: number;
  parentId: number;
  name: "";
  description: "";
  createdAt: "";
  updateAt: "";
  sortId: number;
  parentName: "";
}

const Sectors = () => {
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState<Props[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const response = await axios.get(sectorAPI, {
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
  }, []);

  useEffect(() => {
    console.log("new data:", data);
  }, [data]);

  return (
    <>
      <TopMenu refresh={refresh} setRefresh={setRefresh} />
      <div className="row p-3">
        <SectorsTable refresh={refresh} setRefresh={setRefresh} />
      </div>
    </>
  );
};

export default Sectors;
