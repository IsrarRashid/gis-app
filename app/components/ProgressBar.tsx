import { motion } from "framer-motion";

interface Props {
  value: number;
}

const ProgressBar = ({ value }: Props) => {
  return (
    <div className="row">
      <div className="col-9">
        <div
          className="progress rounded rounded-pill mt-1"
          style={{ height: "10px" }}
        >
          <motion.div
            className="progress-bar rounded rounded-pill"
            style={{
              width: `${value}%`,
              backgroundImage: "linear-gradient(to right, #0C8CE9 , #1A67A0)",
            }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            initial={{ width: "0%" }}
            whileInView={{ width: `${value}%` }}
            transition={{
              duration: 1,
              ease: "easeIn",
            }}
          ></motion.div>
        </div>
      </div>
      <div className="col-1 p-0">
        <span className="text-white">{value}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
