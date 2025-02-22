import { ClerkLoading, SignedIn } from "@clerk/clerk-react";
import { Loader } from "../Loader";
import { useProfile } from "@/hooks/useProfile";

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
          <h1>Media</h1>
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
