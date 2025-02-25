import { useEffect, useRef } from "react";

const WebCam = () => {
  const camElement = useRef<HTMLVideoElement | null>(null);

  const streamWebCam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (camElement.current) {
      camElement.current.srcObject = stream;
      await camElement.current.play();
    }
  };

  useEffect(() => {
    streamWebCam();
  }, []);

  return (
    <video
      ref={camElement}
      className="draggable w-[250px] h-[250px]  object-cover rounded-full  border-2  border-white"
      autoPlay
    ></video>
  );
};

export default WebCam;
