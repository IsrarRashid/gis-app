"use client";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      className="btn d-flex align-items-center rounded-pill fw-5 fs18px w-auto"
      style={{
        border: "1px solid #CBD5E1",
        color: "#475569",
        padding: "16px 24px",
        gap: "12px",
      }}
      onClick={() => router.back()}
    >
      <FaChevronLeft size={24} />
      Go Back
    </Button>
  );
};

export default BackButton;
