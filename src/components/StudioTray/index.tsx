import { selectSources, startRecording, stopRecording } from "@/lib/recorder";
import { cn, videoRecordingTime } from "@/lib/utils";
import { Cast, Pause, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const StudioTray = () => {
  const initialTime = new Date();
  const [recording, setRecording] = useState(false);
  const [preview, setPreview] = useState(false);
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState("00:00:00");
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

  const clearTime = () => {
    setTimer("00:00:00");
    setCount(0);
  };

  window.ipcRenderer.on("profile-received", (event, payload) => {
    setSources(payload);
  });

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
        stopRecording();
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
        <div
          onClick={() => {
            setRecording(true);
            startRecording(sources);
          }}
          className={cn(
            "non-draggable rounded-full cursor-pointer relative hover:opacity-80 ",
            recording ? "bg-red-500 w-6 h-6" : "bg-red-400 w-8 h-8"
          )}
        >
          {recording && (
            <span className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-white">
              {timer}
            </span>
          )}
        </div>
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
            onClick={() => {
              setRecording(false);
              clearTime();
              stopRecording();
            }}
            stroke="white"
          />
        )}
        <Cast
          onClick={() => setPreview((prev) => !prev)}
          size={32}
          className="non-draggable cursor-pointer hover:opacity-60"
          stroke="white"
        />
      </div>
    </div>
  );
};

export default StudioTray;
