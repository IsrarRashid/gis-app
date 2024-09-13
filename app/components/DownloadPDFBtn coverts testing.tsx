import { useRef } from "react";
import jsPDF from "jspdf";
import DownloadFile from "../projects/components/DownloadFile";
import downloadLineBlack from "../../public/icons/downloadLineBlack.svg";
import Image from "next/image";

const DownloadPDFBtn = () => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const downloadPdf = () => {
    const input = componentRef.current;

    if (input) {
      const pdf = new jsPDF("p", "mm", "a4");

      pdf.html(input, {
        callback: function (pdf) {
          // Save the generated PDF
          pdf.save("download.pdf");
        },
        x: 10, // Left margin for the PDF
        y: 10, // Top margin for the PDF
        html2canvas: {
          scale: 1, // Adjust the scale factor for better quality and size adjustment
        },
        width: 190, // A4 page width minus margins
      });
    }
  };

  return (
    <>
      <button
        className="btn text-white rounded-pill shadow ps-3 pe-3 pt-1 pb-1"
        style={{ fontSize: ".8rem", background: "rgba(255, 255, 255,.5)" }}
        onClick={downloadPdf}
      >
        <Image src={downloadLineBlack} alt="download" width={20} height={20} />
      </button>

      {/* Hidden component that is passed to the PDF generator */}
      <div
        ref={componentRef}
        style={{
          display: "none", // Hide the component on the screen but keep it in the DOM
        }}
      >
        <DownloadFile />
      </div>
    </>
  );
};

export default DownloadPDFBtn;
