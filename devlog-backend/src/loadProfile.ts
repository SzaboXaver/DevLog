import { supabase } from "./supabase";

export default async function loadProfile(token: string) {

    const { data: { user }, error: authError } =
        await supabase.auth.getUser(token);

    if (authError || !user) throw authError ?? new Error("User not found");

    const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .maybeSingle();

    if (error) throw error;

    return data;
}