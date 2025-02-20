import { httpClient } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

type Profile = {
  status: number;
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

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

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
    }
  }, [user]);

  return {
    profile,
  };
};
