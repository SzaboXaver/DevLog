import { supabaseAdmin } from "../supabase";
import { encrypt, decrypt } from "../utils/encryption";
import handleExpire from "./handleExpire";

export default async function getValidGitHubToken(userId: string) {

    const { data: connection, error } = await supabaseAdmin
        .from("github_connections")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error || !connection) {
        throw new Error("GitHub connection not found!");
    }

    const accessExpired =
        new Date(connection.token_expires_at).getTime()
        <= Date.now() + 60_000;

    if (!accessExpired) {
        return decrypt(connection.access_token);
    }

    const refreshExpired =
        new Date(connection.refresh_token_expires_at).getTime()
        <= Date.now();

    if (refreshExpired) {
        throw new Error("GITHUB_REAUTH_REQUIRED");
    }

    const oldRefreshToken = decrypt(connection.refresh_token);

    const newTokens = await handleExpire(oldRefreshToken);

    const { error: updateError } = await supabaseAdmin
        .from("github_connections")
        .update({
            access_token: encrypt(newTokens.access_token),
            refresh_token: encrypt(newTokens.refresh_token),

            token_expires_at: new Date(
                Date.now() + newTokens.expires_in * 1000
            ).toISOString(),

            refresh_token_expires_at: new Date(
                Date.now() + newTokens.refresh_token_expires_in * 1000
            ).toISOString()
        })
        .eq("user_id", userId);

    if (updateError) {
        throw updateError;
    }

    return newTokens.access_token;
}