import { UploadCloud } from "lucide-react";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const UploadIndicator = ({ progress }: { progress: number }) => {
  return progress > -1 ? (
    <div className="absolute rounded-full bg-[#171717] w-[94%] flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <h2 className="text-white pl-2 text-xl">video is being uploaded</h2>
        <UploadCloud
          size={32}
          className="non-draggable animate-pulse"
          stroke="white"
        />
      </div>
      <div className="relative w-14 h-14  ">
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            textSize: "25px",
            pathColor: `${progress === 100 ? "green" : "yellow"}`,
            trailColor: "#ffffff80",
            textColor: "white",
          })}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default UploadIndicator;
