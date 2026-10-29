import dayjs from "dayjs";
import { supabase } from "./supabase";

export default async function register(username: string, email: string, password: string) {
    const now = dayjs();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
    });

    if (error) throw error;

    const user_data = {
        username,
        date_when_profile_created: now,
        site_theme: "dark"
    };

    const insertResponse = await supabase
    .from("profiles")
    .insert(user_data);

    if(insertResponse.error) throw insertResponse.error;

    return { username, email };
}