import { Session } from "@supabase/supabase-js";
import { PermissionResponse } from "expo-camera";
import { ThemeMode } from "../UI/theme";

export interface AppData {
  session: Session | null;
  profile: {
    username: string | null;
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
  settings: {
    weight: string;
    glucose: string;
    dateFormat: string;
    clockFormat: string;
    themeMode: ThemeMode;
  };
  diaryEntries: any[];
  isEntriesLoaded: boolean;
}