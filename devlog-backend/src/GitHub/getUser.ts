import axios from "axios";

export default async function getUserProfile(accessToken: string) {
    const userResponse = await axios.get("https://api.github.com/user", {
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${accessToken}`
        }
    });

    const userData = userResponse.data;

    return userData;
}