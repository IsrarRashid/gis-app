"use client";
import downloadBlack2 from "@/public/icons/downloadBlack2.svg";
import excel from "@/public/icons/excel.svg";
import pdf from "@/public/icons/pdf.svg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import styles from "./UserDropDown.module.css";

interface Props {
  onClickPdf?: () => void;
  onClickExcel?: () => void;
}

const DownloadDropDown = ({ onClickPdf, onClickExcel }: Props) => {
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevents SSR crash
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <Button
        className="btn btn-sm rounded-3 shadow-sm"
        onClick={() => setShow(!show)}
        style={{
          background: "rgba(255, 255, 255, 0.62)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
        }}
      >
        <p className="m-0 text-dark fw-normal">
          Downloads&nbsp;
          <Image src={downloadBlack2} alt="download" width={16} height={16} />
        </p>
      </Button>
      <div
        className={`fs12px ${styles.dropdownContent} ${show && styles.show}`}
      >
        {onClickPdf && (
          <Link
            href="#"
            className="btn w-100 fs12px fw-bold text-start shadow-none"
            onClick={onClickPdf}
          >
            <Image
              src={pdf}
              alt="pdf"
              width={16}
              height={16}
              className="mb-1"
            />
            &nbsp;PDF
          </Link>
        )}
        {onClickExcel && (
          <Link
            href="#"
            className="btn w-100 fs12px fw-bold text-start shadow-none"
            onClick={onClickExcel}
          >
            <Image
              src={excel}
              alt="excel"
              width={16}
              height={16}
              className="mb-1"
            />
            &nbsp;Excel
          </Link>
        )}
      </div>
    </div>
  );
};

export default DownloadDropDown;
