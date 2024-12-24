"use client";
import useAuthorization from "@/app/hooks/useAuthorization";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import List from "./List";

const Rights = () => {
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  useAuthorization("rights");

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
        className={"container p-3 mt-3 mb-4"}
        style={{
          background: "rgba(209, 209, 209, 0.4)",
          border: "1px solid #ededed",
          padding: "10px",
          borderRadius: "15px",
        }}
      >
        <div className="row p-3">
          <List refresh={refresh} setRefresh={setRefresh} />
        </div>
      </div>
    </>
  );
};

export default Rights;
