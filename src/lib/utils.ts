import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL,
});

export const getMediaSources = async () => {
  const displays = await window.ipcRenderer.invoke("getSources");

  const enumerateDevices =
    await window.navigator.mediaDevices.enumerateDevices();
  const audioInputs = enumerateDevices.filter(
    (device) => device.kind === "audioinput"
  );

  return { displays, audioInputs };
};

export const studioSchema = z.object({
  screen: z.string(),
  audio: z.string(),
  preset: z.enum(["HD", "SD"]),
});

export const updateStudio = async (
  id: string,
  screen: string,
  audio: string,
  preset: "SD" | "HD"
) => {
  console.log("update studio", { id, screen, audio, preset });
  const response = await httpClient.put(
    `/studio/${id}`,
    {
      screen,
      audio,
      preset,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const hidePluginWindow = (state: boolean) => {
  window.ipcRenderer.send("hide-plugin", { state });
};

export const videoRecordingTime = (ms: number) => {
  const second = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, "0");

  const minute = Math.floor((ms / 1000 / 60) % 60)
    .toString()
    .padStart(2, "0");

  const hour = Math.floor(ms / 1000 / 60 / 60)
    .toString()
    .padStart(2, "0");

  return { length: `${hour}:${minute}:${second}`, minute };
};
