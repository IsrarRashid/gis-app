"use client";
import { useEffect, useState } from "react";
import SectorsTable from "./SectorsTable";
import TopMenu from "./TopMenu";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Sectors = () => {
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

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
