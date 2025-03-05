import { Toaster } from "sonner";
import ControlLayout from "./layouts/ControlLayout";

import MediaConfig from "./components/MediaConfig";
import { useProfile } from "./hooks/useProfile";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import { useRef } from "react";
import { Loader } from "./components/Loader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

function App() {
  const userIdRef = useRef<HTMLInputElement>(null);
  const { profile, setProfile, state, setUserId, isLoading, error } =
    useProfile();
  console.log("profile", profile);
  return (
    <QueryClientProvider client={client}>
      <ControlLayout
        setProfile={setProfile}
        setUserId={setUserId}
        userLogo={profile?.user?.image}
      >
        {profile ? (
          <div className="p-5">
            <MediaConfig user={profile.user} state={state} />
          </div>
        ) : !window.localStorage.getItem("userId") ? (
          <div className="p-5 flex flex-col space-y-3  rounded-xl shadow-lg">
            <Label
              htmlFor="userid"
              className="text-gray-300 text-sm font-medium"
            >
              User ID
            </Label>
            <Input
              ref={userIdRef}
              className="text-white bg-[#2A2A2A] border border-[#3A3A3A] focus:ring-2 focus:ring-[#6366F1] p-3 h-12 rounded-lg placeholder:text-gray-500"
              type="text"
              id="userid"
              placeholder="Enter user ID"
            />
            <div className="text-red-500 text-sm">
              {error && "Failed to fetch user profile"}
            </div>
            <Button
              onClick={() => {
                setUserId(userIdRef.current!.value);
                userIdRef.current!.value = "";
              }}
              variant="outline"
              className=" bg-[#bdbbbb]  hover:bg-[#D9D9D9]  transition"
            >
              {isLoading ? <Loader /> : "Login"}
            </Button>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        )}
      </ControlLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
