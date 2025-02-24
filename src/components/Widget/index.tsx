import { ClerkLoading, SignedIn } from "@clerk/clerk-react";
import { Loader } from "../Loader";
import { useProfile } from "@/hooks/useProfile";
import MediaConfig from "../MediaConfig";

const Widget = () => {
  const { profile, state } = useProfile();

  return (
    <div className="p-5">
      <ClerkLoading>
        <div className="h-full flex justify-center items-center">
          <Loader color="#fff" />
        </div>
      </ClerkLoading>
      <SignedIn>
        {profile ? (
          <MediaConfig user={profile.user} state={state} />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Loader color="#fff" />
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default Widget;
