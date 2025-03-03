import { selectSources, startRecording, stopRecording } from "@/lib/recorder";
import { cn, videoRecordingTime } from "@/lib/utils";
import { Camera, CameraOff, Cast, Pause, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UploadVideo from "./UploadIndicator";

const Cam = () => {
  const [showCam, setShowCam] = useState(false);

  return showCam ? (
    <Camera
      size={32}
      className="non-draggable cursor-pointer hover:opacity-60"
      stroke="white"
      onClick={() => {
        window.ipcRenderer.send("hide-webcam");

        setShowCam(false);
      }}
    />
  ) : (
    <CameraOff
      size={32}
      className="non-draggable cursor-pointer hover:opacity-60"
      stroke="white"
      onClick={() => {
        window.ipcRenderer.send("show-webcam");

        setShowCam(true);
      }}
    />
  );
};

const StudioTray = () => {
  const initialTime = new Date();
  const [recording, setRecording] = useState(false);
  const [preview, setPreview] = useState(false);
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState("00:00:00");
  const [progress, setProgress] = useState(-1);

  const [sources, setSources] = useState<
    | {
        screen: string;
        id: string;
        audio: string;
        preset: "HD" | "SD";
        plan: "PRO" | "FREE";
      }
    | undefined
  >(undefined);

  // Handle recording stop and upload
  const handleStopRecording = async () => {
    setRecording(false);
    clearTime();
    await stopRecording(setProgress);
  };

  // Reset file path after upload is complete

  const clearTime = () => {
    setTimer("00:00:00");
    setCount(0);
  };

  useEffect(() => {
    window.ipcRenderer.on("profile-received", (_, payload) => {
      setSources(payload);
    });

    return () => {
      window.ipcRenderer.removeAllListeners("profile-received");
    };
  }, []);

  useEffect(() => {
    if (sources && sources.screen) selectSources(sources, videoElement);

    return () => {
      selectSources(sources!, videoElement);
    };
  }, [sources]);

  useEffect(() => {
    if (!recording) return;

    const recordTimeInterval = setInterval(() => {
      const time = count + (new Date().getTime() - initialTime.getTime());
      setCount(time);

      const recordingTime = videoRecordingTime(time);

      if (sources?.plan === "FREE" && recordingTime.minute == "05") {
        setRecording(false);
        clearTime();
        stopRecording(setProgress);
      }

      setTimer(recordingTime.length);

      if (time <= 0) {
        setTimer("00:00:00");
        clearInterval(recordTimeInterval);
      }
    }, 1);

    return () => clearInterval(recordTimeInterval);
  }, [recording]);

  return !sources ? (
    <></>
  ) : (
    <div className="flex flex-col justify-end gap-y-5 h-screen">
      <video
        autoPlay
        ref={videoElement}
        className={cn(
          "w-6/12 border-2 self-end rounded-lg border-white/40",
          !preview ? "hidden" : ""
        )}
      ></video>

      <div className="rounded-full flex justify-around items-center h-20 w-full border-2 bg-[#171717] draggable border-white/40">
        {!recording ? (
          <div
            onClick={() => {
              setRecording(true);
              startRecording(sources);
            }}
            className={cn(
              "non-draggable rounded-full cursor-pointer relative hover:opacity-80 ",
              recording ? "bg-red-500 w-6 h-6" : "bg-red-400 w-8 h-8"
            )}
          ></div>
        ) : (
          <p className="text-white w-6 mr-5">{timer}</p>
        )}
        {!recording ? (
          <Pause
            className="non-draggable opacity-50"
            size={32}
            stroke="white"
          />
        ) : (
          <Square
            size={32}
            className="non-draggable cursor-pointer hover:scale-110 transform transition duration-150"
            fill="white"
            onClick={handleStopRecording}
            stroke="white"
          />
        )}
        <Cast
          onClick={() => setPreview((prev) => !prev)}
          size={32}
          className="non-draggable cursor-pointer hover:opacity-60"
          stroke="white"
        />
        <Cam />

        <UploadVideo progress={progress} />
      </div>
    </div>
  );
};

export default StudioTray;
