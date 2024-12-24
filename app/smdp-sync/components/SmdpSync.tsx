"use client";
import useAuthorization from "@/app/hooks/useAuthorization";
import { useEffect, useState } from "react";
import Table from "./Table";

const SmdpSync = () => {
  const [refresh, setRefresh] = useState(false);
  const [showData, setShowData] = useState(false);
  useAuthorization("smdp-sync");

  useEffect(() => {
    // Set the background for the body
    document.body.style.backgroundImage = `url('/images/bg2.png')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";

    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <>
      <div
        className="container p-3 mt-3 mb-4"
        style={{
          background: "rgba(209, 209, 209, 0.4)",
          border: "1px solid #dbdbdb",
          padding: "10px",
          borderRadius: "15px",
        }}
      >
        <div className="row p-3">
          <Table
            showData={showData}
            setShowData={setShowData}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        </div>
      </div>
    </>
  );
};

export default SmdpSync;
