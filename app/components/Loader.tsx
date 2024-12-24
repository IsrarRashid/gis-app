import EarthLoading from "@/app/earthLoading.json";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const Loader = () => {
  const colors = [
    "primary",
    "secondary",
    "info",
    "warning",
    "danger",
    "dark",
    "success",
  ];

  const getRandomColor = (colors: string[]): string => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const [color, setColor] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const randomColor = getRandomColor(colors);
    setColor(randomColor);
  }, []);

  return (
    <div
      style={{
        background: "rgba(0, 0, 0,.4)",
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.div
        style={{ width: "100px", height: "100px" }}
        animate={{
          scale: [1, 1.2, 1], // Keyframes for zoom in and zoom out
        }}
        transition={{
          duration: 2, // Total duration for one cycle
          repeat: Infinity, // Loop the animation
          ease: "easeInOut", // Smooth easing
        }}
      >
        <Lottie animationData={EarthLoading} loop={true} />
      </motion.div>
    </div>
  );
};

export default Loader;

{
  /* <div
              className="position-relative col text-center"
              style={{ height: "400px" }}
            >
              <div
                className="position-absolute spinner-border text-primary"
                role="status"
                style={{
                  width: "300px",
                  height: "300px",
                  top: 50,
                  left: 400,
                }}
              >
                &nbsp;
              </div>
              <div
                className="position-absolute spinner-border text-danger"
                role="status"
                style={{
                  width: "250px",
                  height: "250px",
                  top: 75,
                  left: 425,
                }}
              >
                &nbsp;
              </div>
              <div
                className="position-absolute spinner-border text-warning"
                role="status"
                style={{
                  width: "200px",
                  height: "200px",
                  top: 100,
                  left: 450,
                }}
              >
                &nbsp;
              </div>
              <div
                className="position-absolute spinner-border text-info"
                role="status"
                style={{
                  width: "150px",
                  height: "150px",
                  top: 125,
                  left: 475,
                }}
              >
                &nbsp;
              </div>
              <div
                className="position-absolute spinner-border text-success"
                role="status"
                style={{
                  width: "100px",
                  height: "100px",
                  top: 150,
                  left: 500,
                }}
              >
                &nbsp;
              </div>
              <div
                className="position-absolute spinner-border text-secondary"
                role="status"
                style={{
                  width: "50px",
                  height: "50px",
                  top: 175,
                  left: 525,
                }}
              >
                &nbsp;
              </div>
              <div
                className="position-absolute spinner-border text-dark"
                role="status"
                style={{
                  width: "10px",
                  height: "10px",
                  top: 195,
                  left: 545,
                }}
              >
                &nbsp;
              </div>
            </div> */
}
