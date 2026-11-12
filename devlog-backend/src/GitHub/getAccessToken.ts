import axios from "axios";

export default async function getAccessToken(code: string) {
    const params = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI
    };

    const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        params,
        {
            headers: {
                Accept: "application/json"
            }
        }
    );
    return response.data;
}