import Image from "next/image";
import profilePic3 from "../../../public/images/profilePic3.png";
import compass from "../../../public/icons/compass.svg";
import locationPointBlue2 from "../../../public/icons/locationPointBlue2.svg";
import more from "../../../public/icons/more.svg";
import twoCirclesVertical from "../../../public/icons/twoCirclesVertical.svg";
import profilePic4 from "../../../public/images/profilePic4.png";
import profilePic5 from "../../../public/images/profilePic5.png";
import calendar from "../../../public/icons/calendar.svg";
import phone from "../../../public/icons/phone.svg";
import moreDotsBlue from "../../../public/icons/moreDotsBlue.svg";
import userAdd from "../../../public/icons/userAdd.svg";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Button from "@/app/components/Button";

const StaffMember = () => {
  const items = ["a", "a", "a", "a", "a", "a"];
  const items2 = ["a", "a", "a", "a", "a", "a"];

  const refContainer1 = useRef<HTMLDivElement>(null);
  const refContent1 = useRef<HTMLDivElement>(null);
  const [constraints1, setConstraints1] = useState({});

  useEffect(() => {
    // Wait until both container and content are rendered
    if (refContainer1.current && refContent1.current) {
      // Calculate the width difference between container and content
      const containerHeight = refContainer1.current.offsetHeight;
      const contentHeight = refContent1.current.scrollHeight;
      // Set drag constraints dynamically based on the difference
      setConstraints1({ bottom: 0, top: -(contentHeight - containerHeight) });
    }
  }, []); // Recalculate if the items change

  const refContainer2 = useRef<HTMLDivElement>(null);
  const refContent2 = useRef<HTMLDivElement>(null);
  const [constraints2, setConstraints2] = useState({});

  useEffect(() => {
    // Wait until both container and content are rendered
    if (refContainer2.current && refContent2.current) {
      // Calculate the width difference between container and content
      const containerHeight = refContainer2.current.offsetHeight;
      const contentHeight = refContent2.current.scrollHeight;
      // Set drag constraints dynamically based on the difference
      setConstraints2({ bottom: 0, top: -(contentHeight - containerHeight) });
    }
  }, []); // Recalculate if the items change

  return (
    <div
      className="col mb-3 ms-2 me-2"
      style={{ borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div
        className="col"
        style={{
          marginRight: "10px",
          marginLeft: "10px",
          marginBottom: "15px",
          paddingTop: "20px",
        }}
      >
        <div className="row d-flex mb-1">
          <div className="col">
            <h4 className="fw-bold fs18px mt-2">Staff Member</h4>
          </div>
          <div className="col text-end">
            <Button
              className="btn rounded-pill fs14px color-sea-blue fw-normal"
              style={{
                padding: "10px 20px 10px 20px",
                background: "#E0EEFC",
              }}
            >
              Add Staff &nbsp;
              <Image src={userAdd} alt="userAdd" />
            </Button>
          </div>
        </div>
      </div>
      <div
        className="row d-flex p-4 pt-3 pb-2 m-0 bg-color-matte-light-blue shadow-sm"
        style={{ borderRadius: "10px" }}
      >
        <div
          className="col-lg-12 col-md-12 col-sm-12"
          ref={refContainer1}
          style={{
            height: "210px",
            whiteSpace: "nowrap",
            overflowY: "scroll",
            overflow: "hidden",
          }}
        >
          <motion.div
            className="d-flex flex-column"
            drag="y" // Allow horizontal dragging
            dragConstraints={constraints1} // Adjust based on content size
            whileTap={{ cursor: "grabbing" }}
            ref={refContent1}
          >
            {items.map((d, i) => (
              <div
                key={i}
                className="row d-flex bg-white rounded-pill p-2 mb-2"
              >
                <div className="col-lg-10 col-md-10 col-sm-12 p-0">
                  <div className="row d-flex">
                    <div className="col-lg-2 col-md-2 col me-3">
                      <Image src={profilePic3} alt="profilePic3" />
                    </div>
                    <div className="col-lg-8 col-md-9 col">
                      <p
                        className="ps-2 fs13px"
                        style={{
                          marginTop: "13px",
                          marginBottom: "0px",
                          color: "#A5A5A5",
                          fontWeight: 500,
                        }}
                      >
                        Sundas
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-2 col-md-2 col text-end"
                  style={{ marginTop: "13px" }}
                >
                  <Image src={moreDotsBlue} alt="moreDotsBlue" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StaffMember;
