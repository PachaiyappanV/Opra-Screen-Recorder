import { httpClient } from "@/lib/utils";
import { Profile } from "@/types";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useMediaSources } from "./useMediaSources";

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { state, fetchMediaResources } = useMediaSources();

  const { user } = useUser();

  const fetchUserProfile = async (userId: string) => {
    const response = await httpClient.get(`/auth/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    setProfile(response.data);
  };

  useEffect(() => {
    if (user && user.id) {
      fetchUserProfile(user.id);
      fetchMediaResources();
    }
  }, [user]);

  return {
    profile,
    state,
  };
};
