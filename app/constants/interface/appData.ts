import { Session } from "@supabase/supabase-js";
import { PermissionResponse } from "expo-camera";

export interface AppData {
  session: Session | null;
  permission: PermissionResponse | null;
  requestCameraPermission: () => Promise<PermissionResponse>;
  profile: {
    username: string | null;
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
  settings: {
    weight: string;
    glucose: string;
  };
  diaryEntry: {
    id: string;
    created_at: Date;
    glucose: number;
    carbs: number;
    insulin: number;
    meal_type: string;
    activity_level: string;
    photos: [];
  }
}