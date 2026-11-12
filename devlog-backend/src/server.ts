import express from "express";
import cors from "cors";
import { supabaseAdmin } from "./supabaseAdmin.js";
import Jwt from "jsonwebtoken";
import { getApp } from "./getApp.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());

app.get("/api/github/install-url", async (req, res) => {
    const userToken = req.headers.authorization?.replace("Bearer ", "");
    const { data, error } = await supabaseAdmin.auth.getUser(userToken);
    if (error || !data) return res.status(401).end();

    const state = Jwt.sign({ user_id: data.user?.id }, process.env.STATE_SECRET!, { expiresIn: "10m" });
    res.json({ url: `https://github.com/apps/szaboxaver-devlog/installations/new?state=${state}` });
});

app.get("/github/callback", async (req, res) => {
    const installation_id = Number(req.query.installation_id);
    const { user_id } = Jwt.verify(req.query.state as string, process.env.STATE_SECRET!) as { user_id: string };

    const octokit = await getApp(installation_id);
    const { data } = await octokit.request("GET /installation/repositories");

    const rows = data.repositories.map((repo: any) => ({
        github_repo_id: repo.id,
        installation_id,
        user_id,
        name: repo.name,
        full_name: repo.full_name,
        private: repo.private,
        html_url: repo.html_url,
    }));

    const { error } = await supabaseAdmin
        .from("repositories")
        .upsert(rows, { onConflict: "github_repo_id" });
    if (error) return res.status(500).json({ error });

    return res.redirect("http://localhost:5173/home/createProject");
});

app.get("/api/github/loadRepositories", async (req, res) => {
    const userToken = req.headers.authorization?.replace("Bearer ", "");
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(userToken);
    if (error || !user) return res.status(401).end();

    const { data: selectRepo, error: selectRepoError } = await supabaseAdmin
        .from("repositories").select("*").eq("user_id", user.id);
    if (selectRepoError) return res.status(500).json({ message: "Error during fetching repositories", error: selectRepoError });

    const { data: selectProject, error: selectProjectError } = await supabaseAdmin
        .from("projects").select("*").eq("user_id", user.id);
    if (selectProjectError) return res.status(500).json({ message: "Error during fetching projects", error: selectProjectError });

    return res.status(200).json({ selectProject, selectRepo });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});