import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DownloadFile from "../projects/components/DownloadFile";
import download2 from "../../public/icons/download2.svg";
import Image from "next/image";

const DownloadPDFBtn = () => {
  // Correctly typing useRef as an HTMLDivElement or null
  const componentRef = useRef<HTMLDivElement | null>(null);

  const downloadPdf = () => {
    const input = componentRef.current;

    // Ensure input is not null
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210; // A4 size in mm (width)
        const pageHeight = 295; // A4 size in mm (height)
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add new pages if the content overflows
        while (heightLeft > 0) {
          position = heightLeft - imgHeight; // top position for next page
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("download.pdf");
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
        <Image src={download2} alt="download" width={20} height={20} />
      </button>
      {/* Component to be downloaded */}
      <div
        style={{
          position: "absolute",
          top: "-10000px", // Move the component off-screen
          left: "-10000px",
        }}
        ref={componentRef}
      >
        <DownloadFile />
      </div>
    </>
  );
};

export default DownloadPDFBtn;
