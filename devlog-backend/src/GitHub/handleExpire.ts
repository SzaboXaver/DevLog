import axios from "axios";

interface GitHubTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
    token_type: string;
    scope: string;
}

export default async function handleExpire(refreshToken: string) {
    try {
        const params = new URLSearchParams({
            client_id: process.env.GITHUB_CLIENT_ID!,
            client_secret: process.env.GITHUB_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        });

        const response = await axios.post<GitHubTokenResponse>(
            "https://github.com/login/oauth/access_token",
            params,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        if (!response.data.access_token) {
            throw new Error("GitHub did not return a new access token");
        }

        return response.data;

    } catch (err: any) {
        console.error("GitHub token refresh failed:", err.response?.data ?? err.message);
        throw new Error("Error during refreshing GitHub access token!");
    }
}