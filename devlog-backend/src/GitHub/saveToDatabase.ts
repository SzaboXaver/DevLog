import { supabase, supabaseAdmin } from "../supabase.ts";
import { encrypt } from "../utils/encryption.ts";
import dayjs from "dayjs";

export default async function saveGitHubData(
    connectionData: {
        githubId: number;
        access_token: string;
        expires_in: number;
        refresh_token: string;
        refresh_token_expires_in: number;
    },
    userData: {
        GitHubId: number;
        name: string;
        email: string;
        avatar_url: string;
        created_at: string;
        profile_url: string;
    },
    userToken: string | null = null
) {
    const { githubId, access_token, expires_in, refresh_token, refresh_token_expires_in } = connectionData;
    const { GitHubId, name, email, avatar_url, created_at, profile_url } = userData;
    console.log("User token exists:", !!userToken);
    try {
        const { data: { user }, error: authError } =
            await supabase.auth.getUser(userToken!);

        if (authError || !user) throw authError ?? new Error("User not found");

        const { error } = await supabaseAdmin
            .from("github_connections")
            .upsert({
                user_id: user.id,
                github_user_id: githubId,
                access_token: encrypt(access_token),
                refresh_token: encrypt(refresh_token),
                token_expires_at: new Date(
                    Date.now() + expires_in * 1000
                ).toISOString(),
                refresh_token_expires_at: new Date(
                    Date.now() + refresh_token_expires_in * 1000
                ).toISOString(),
            }, {
                onConflict: "github_user_id"
            });

        if (error) throw error;

        const { error: profileError } = await supabaseAdmin
            .from("github_profiles")
            .upsert({
                user_id: user.id,
                github_user_id: GitHubId,
                name,
                email,
                avatar_url,
                created_at,
                profile_url
            }, {
                onConflict: "github_user_id"
            });

        if (profileError) throw profileError;

    } catch (err: any) {
        console.error("GitHub save error:", err);
        throw err;
    }
}

export async function saveProjectData(usertoken : string | null, projectData: { title: string; description: string; }){
    try {
        console.log("User token exists:", usertoken);
        console.log(projectData.title, projectData.description);
        const now = dayjs().format("YYYY-MM-DD");
        const { data: { user }, error: authError } =
            await supabase.auth.getUser(usertoken!);
        const userId = user?.id;
        console.log("User ID:", userId);
        console.log(authError);
        if (authError || !userId) throw authError;

        const { error } = await supabaseAdmin
            .from("projects")
            .insert({
                user_id: userId,
                title: projectData.title,
                description: projectData.description,
                status: "active",
                date_of_start: now,
                date_of_done: null,
                error_id: null,
            });
        if (error) throw error;
        return { message: "Project data saved successfully!" };
    } catch (err: any) { throw err; }
}