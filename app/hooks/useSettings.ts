// hooks/useSettings.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosClient from "@/services/AxiosClient";

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  books_count: number;
  favourite_books_count: number;
  language?: string;
  voice?: string;
  pitch?: number;
  rate?: number;
};

export type UserSettings = {
  id: number;
  name: string;
  email: string;
  language: string;
  voice: string;
  pitch: number;
  rate: number;
};

export type UpdateSettingsPayload = {
  language: string;
  voice: string;
  pitch: number;
  rate: number;
};

// ---- GET user profile ----
export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await AxiosClient.get("/profile");
      return res.data.data;
    },
  });
}

// ---- GET user settings (if you need a separate endpoint) ----
export function useUserSettings() {
  return useQuery<UserSettings>({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const res = await AxiosClient.get("/settings"); // Adjust endpoint if needed
      return res.data.data;
    },
  });
}

// ---- UPDATE user settings ----
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: UpdateSettingsPayload) => {
      const res = await AxiosClient.post("/settings", settings);
      return res.data.data;
    },
    onSuccess: (data) => {
      // Update both profile and settings queries with new data
      queryClient.setQueryData(["profile"], (old: UserProfile | undefined) =>
        old ? { ...old, ...data } : data
      );
      queryClient.setQueryData(["user-settings"], data);
    },
  });
}
