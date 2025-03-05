import { httpClient } from "@/lib/utils";
import { Profile } from "@/types";

import { useEffect, useState } from "react";
import { useMediaSources } from "./useMediaSources";

export const useProfile = () => {
  const [userId, setUserId] = useState<string | null>(
    window.localStorage.getItem("userId")
  );
  console.log("userId", userId);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { state, fetchMediaResources } = useMediaSources();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await httpClient.get(`/auth/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response", response);
      if (response.data.status !== 200) {
        throw new Error("Failed to fetch user profile");
      }

      setProfile(response.data);
      setIsLoading(false);
      setError(false);
      window.localStorage.setItem("userId", userId);
    } catch (error) {
      setError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaResources();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId]);

  return {
    profile,
    setProfile,
    state,
    setUserId,
    isLoading,
    error,
  };
};
