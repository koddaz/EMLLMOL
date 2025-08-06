import { Session } from "@supabase/supabase-js";

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
  };
}