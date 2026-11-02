import express, { response } from "express";
import register from "./register";
import login from "./login";
import loadProfile from "./loadProfile";
import cors from "cors";
import getAccessToken from "./GitHub/getAccessToken";
import getUser from "./GitHub/getUser";
import saveGitHubData from "./GitHub/saveToDatabase";
import getValidGitHubToken from "./GitHub/getValidGitHubToken";
import { saveProjectData } from "./GitHub/saveToDatabase";
import { supabase } from "./supabase";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));

const PORT = process.env.PORT ?? 3000;



app.use(express.json());

app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Fill every input!" });
        }

        const user = await register(username, email, password);

        return res.status(201).json({
            message: "Successful account creation!",
            ...user
        });
    } catch (err: any) {
        return res.status(400).json({
            message: "Error during creating account!",
            error: err.message
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Fill every input!" });
        }

        const response = await login(email, password);

        return res.status(200).json({
            message: "Successful login!",
            access_token: response.access_token,
            refresh_token: response.refresh_token
        });
    } catch (err: any) {
        return res.status(401).json({
            message: "Invaild email or password! Try again!"
        });
    }
});
let token: string | null = null;
app.get("/loadProfile", async (req, res) => {
    const authorization = req.headers.authorization;
    token = authorization?.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length)
        : null;

    if (!token) {
        return res.status(401).json({ message: "Missing access token" });
    }
    try {
        const profile = await loadProfile(token);
        return res.status(200).json(profile);
    } catch (err: any) {
        return res.status(500).json({ message: "Error during fetching user profile! Please try refresh the page!" });
    }
});

app.get("/github/callback", async (req, res) => {

    try {
        console.log("Token exists:", !!token);
        const code = req.query.code as string;
        if (!code) {
            return res.status(400).json({ message: "Missing code parameter" });
        }
        const response = await getAccessToken(code);

        const data = response;
        const accessToken = data.access_token;

        const userData = await getUser(accessToken);

        await saveGitHubData(
            {
                githubId: userData.id,
                access_token: data.access_token,
                expires_in: data.expires_in,
                refresh_token: data.refresh_token,
                refresh_token_expires_in: data.refresh_token_expires_in
            },
            {
                GitHubId: userData.id,
                name: userData.name,
                email: userData.email,
                avatar_url: userData.avatar_url,
                created_at: userData.created_at,
                profile_url: userData.html_url
            },
            token
        );

        return res.redirect("http://localhost:5173/createProject");
    } catch (err: any) {
        return res.status(500).json({ message: "Internal server error!", error: err.message });
    }
});

app.get("/github/auth", async (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: process.env.GITHUB_REDIRECT_URI!,
        scope: "repo read:user user:email"
    });

    res.redirect(
        `https://github.com/login/oauth/authorize?${params.toString()}`
    );
});

app.get("/github/load", async (req, res) => {
    try {
        const supabaseToken = req.query.supabaseToken as string;
        if (!supabaseToken) {
            return res.status(400).json({ message: "Missing supabaseToken parameter" });
        }

        const { data: { user }, error: authError } =
            await supabase.auth.getUser(supabaseToken);

        if (authError || !user) {
            return res.status(401).json({ message: "Invalid supabase token" });
        }

        const githubToken = await getValidGitHubToken(user.id);

    } catch (err: any) {
        return res.status(500).json({ message: "Internal server error!", error: err.message });
    }
});

app.post("/createProject", async (req, res) => {
    try {
        const { title, description, token } = req.body;
        console.log("Received project data:", title, description);

        if (!title || !description) {
            throw new Error("Missing title or description");
        }

        const response = await saveProjectData(token, { title, description });
        if (response.message === "Project data saved successfully!") {
            return res.status(200).json({
                success: true,
                redirect: "/home"
            });
        }
    } catch (err: any) {
        return res.status(500).json({ message: "Internal server error!", error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});