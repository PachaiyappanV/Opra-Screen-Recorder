import { SourceDeviceStateProps } from "@/types";
import { Mic, Monitor, Settings2 } from "lucide-react";
import { Loader } from "../Loader";
import { useStudioSettings } from "@/hooks/useStudioSettings";

type Props = {
  state: SourceDeviceStateProps;
  user: {
    subscription: {
      plan: "PRO" | "FREE";
    } | null;
    studio: {
      id: string;
      screen: string | null;
      mic: string | null;
      preset: "HD" | "SD";
      camera: string | null;
      userId: string | null;
    } | null;
    id: string;
    email: string;
    firstname: string | null;
    lastname: string | null;
    createdAt: Date;
    clerkId: string;
  } | null;
};

const MediaConfig = ({ state, user }: Props) => {
  let screen = state.displays?.find(
    (display) => display.id === user?.studio?.screen
  );
  let audio = state.audioInputs?.find(
    (audio) => audio.deviceId === user?.studio?.mic
  );
  if (!screen) {
    screen = state.displays?.[0];
  }
  if (!audio) {
    audio = state.audioInputs?.[0];
  }

  const { isPending, register } = useStudioSettings(
    user!.id,
    screen?.id,
    audio?.deviceId,
    user?.studio?.preset,
    user?.subscription?.plan
  );

  return (
    <form className="flex h-full relative w-full flex-col gap-y-5">
      {isPending && (
        <div className="fixed z-50 w-[96%] top-2 left-2 right-0 bottom-0 rounded-2xl h-[94.5%] bg-black/90 flex justify-center items-center">
          <Loader />
        </div>
      )}
      <div className="flex gap-x-5 justify-center items-center">
        <Monitor color="#575655" size={36} stroke="white" />
        <select
          {...register("screen")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          {state.displays?.map((display, key) => (
            <option
              key={key}
              value={display.id}
              selected={screen && screen.id === display.id}
              className="bg-[#171717] cursor-pointer"
            >
              {display.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-x-5 justify-center items-center">
        <Mic color="#575655" size={36} stroke="white" />
        <select
          {...register("audio")}
          defaultValue={audio?.deviceId}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          {state.audioInputs?.map((device, key) => (
            <option
              key={key}
              value={device.deviceId}
              selected={audio && audio.deviceId === device.deviceId}
              className="bg-[#171717] cursor-pointer"
            >
              {device.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-x-5 justify-center items-center">
        <Settings2 color="#575655" size={36} stroke="white" />
        <select
          {...register("preset")}
          className="outline-none cursor-pointer px-5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          <option
            value="HD"
            disabled={user?.subscription?.plan === "FREE"}
            selected={user?.studio?.preset === "HD"}
            className="bg-[#171717] cursor-pointer"
          >
            1080p{" "}
            {user?.subscription?.plan === "FREE" && "(Upgrade to PRO plan)"}
          </option>
          <option
            value="SD"
            selected={user?.studio?.preset === "SD"}
            className="bg-[#171717] cursor-pointer"
          >
            720p
          </option>
        </select>
      </div>
    </form>
  );
};

export default MediaConfig;
