import { studioSchema, updateStudio } from "@/lib/utils";
import useZodForm from "./useZodForm";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

export const useStudioSettings = (
  id: string,
  screen?: string | null,
  audio?: string | null,
  preset?: "SD" | "HD",
  plan?: "PRO" | "FREE"
) => {
  const [onPreset, setPreset] = useState<"SD" | "HD" | undefined>();
  const { register, watch } = useZodForm(studioSchema, {
    screen: screen!,
    audio: audio!,
    preset: preset!,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-studio"],
    mutationFn: (data: {
      id: string;
      screen: string;
      audio: string;
      preset: "SD" | "HD";
    }) => updateStudio(data.id, data.screen, data.audio, data.preset),
  });

  useEffect(() => {
    if (screen && audio) {
      window.ipcRenderer.send("media-sources", {
        screen,
        audio,
        preset,
        id,
        plan,
      });
    }
  }, [screen, audio]);

  useEffect(() => {
    const subscribe = watch((values) => {
      console.log("values", values);
      mutate({
        id,
        screen: values.screen!,
        audio: values.audio!,
        preset: values.preset!,
      });

      window.ipcRenderer.send("media-sources", {
        screen: values.screen!,
        audio: values.audio!,
        preset: values.preset!,
        id,
        plan,
      });
    });

    return () => subscribe.unsubscribe();
  }, [watch]);

  return { register, isPending, onPreset };
};
