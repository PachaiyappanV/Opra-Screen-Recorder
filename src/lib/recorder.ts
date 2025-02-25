import { hidePluginWindow } from "./utils";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";

let videoTransferFileName: string | undefined;
let mediaRecorder: MediaRecorder;
let userId: string;

const socket = io(import.meta.env.VITE_SOCKET_URL as string);

export const onDataAvailable = (e: BlobEvent) => {
  console.log(e.data);
  socket.emit("video-chunks", {
    chunks: e.data,
    fileName: videoTransferFileName,
  });
};
export const onStopRecording = () => {
  hidePluginWindow(false);
  socket.emit("process-video", {
    fileName: videoTransferFileName,
    userId,
  });
};

export const selectSources = async (
  onSources: {
    screen: string;
    audio: string;
    id: string;
    preset: "HD" | "SD";
  },
  videoElement: React.RefObject<HTMLVideoElement>
) => {
  if (onSources && onSources.screen && onSources.audio && onSources.id) {
    const constraints: any = {
      audio: false,

      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: onSources?.screen,
          minWidth: onSources.preset === "HD" ? 1920 : 1280,
          maxWidth: onSources.preset === "HD" ? 1920 : 1280,
          minHeight: onSources.preset === "HD" ? 1080 : 720,
          maxHeight: onSources.preset === "HD" ? 1080 : 720,
          frameRate: 30,
        },
      },
    };
    userId = onSources.id;

    // Creating the stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log("stream", stream);
    // Audio & webcam stream
    const audioStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: onSources?.audio
        ? { deviceId: { exact: onSources.audio } }
        : false,
    });

    if (videoElement && videoElement.current) {
      setTimeout(() => {
        videoElement.current!.srcObject = stream;
        videoElement.current!.play();
      }, 100);
    }

    const combinedStream = new MediaStream([
      ...stream.getTracks(),
      ...audioStream.getTracks(),
    ]);

    mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm; codecs=vp9",
    });

    mediaRecorder.ondataavailable = onDataAvailable;
    mediaRecorder.onstop = onStopRecording;
  }
};

export const startRecording = (sources: {
  screen: string;
  audio: string;
  id: string;
}) => {
  hidePluginWindow(true);
  videoTransferFileName = `${uuid()}-${sources?.id.slice(0, 8)}.webm`;
  mediaRecorder.start(1000);
};

export const stopRecording = () => mediaRecorder.stop();
