import { supabase } from "./supabase";

export default async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;

    return {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
    }
}