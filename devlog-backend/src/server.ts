import express from "express";
import cors from "cors";
import { supabaseAdmin } from "./supabaseAdmin.js";
import Jwt from "jsonwebtoken";
import { getApp } from "./getApp.js";
import https from "https";
import fs from "fs";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

const PORT = process.env.SERVER_PORT || 3000;

const sslOptions = {
    key: fs.readFileSync("./localhost+2-key.pem"),
    cert: fs.readFileSync("./localhost+2.pem")
}

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
        stargazers_count: repo.stargazers_count
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

    const installationId = selectRepo.map((repo: any) => {
        return (repo.installation_id);
    });

    const installId = installationId[0];
    if (!installId) return res.status(200).json({ selectProject, selectRepo, userData: null });

    const octokit = await getApp(installId);

    const response = await octokit.request(
        "GET /app/installations/{installation_id}",
        {
            installation_id: installId,
        }
    );

    const githubUser = response.data.account;

    if (!githubUser) return res.status(500).end();

    let dataResponse;

    if ("login" in githubUser) {
        dataResponse = await octokit.request(
            "GET /users/{username}",
            {
                username: githubUser.login,
            }
        );

    }
    const userData = dataResponse?.data;
    console.log(userData);

    return res.status(200).json({ selectProject, selectRepo, userData });
});

app.get("/api/github/loadRepository", async (req, res) => {
    const userToken = req.headers.authorization?.replace("Bearer ", "");
    const repoId = req.query["repoId"];

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(userToken);
    if (error || !user) return res.status(401).end();

    const { data: selectRepo, error: selectRepoErorr } = await supabaseAdmin
        .from("repositories").select("full_name, name, installation_id").eq("user_id", user.id).eq("github_repo_id", repoId);
    if (selectRepoErorr) return res.status(500).json({ message: "Error during fetching repository", error: selectRepoErorr });

    const installationIds = selectRepo.map((repo) => {
        return (repo.installation_id);
    });

    const octokit = await getApp(installationIds[0]);

    const repositories = await Promise.all(selectRepo.map(async (repo) => {
        const owner = repo.full_name.split("/")[0];
        const repoName = repo.name;

        //Commits
        const commits = await octokit.request(
            "GET /repos/{owner}/{repo}/commits",
            {
                owner: owner,
                repo: repoName,
                per_page: 10,
            }
        );

        //Files
        const branch = await octokit.request(
            "GET /repos/{owner}/{repo}/branches/{branch}",
            {
                owner: owner,
                repo: repoName,
                branch: "main",
            }
        );

        const treeSha = branch.data.commit.commit.tree.sha;

        const files = await octokit.request(
            "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
            {
                owner: owner,
                repo: repoName,
                tree_sha: treeSha,
                recursive: "1",
            }
        );

        return { commits, files };
    }));


    return res.status(200).json(repositories);
});

https.createServer(sslOptions, app).listen(3000);