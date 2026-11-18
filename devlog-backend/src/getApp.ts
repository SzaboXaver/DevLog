import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "octokit";
const privateKey = Buffer.from(process.env.GITHUB_PRIVATE_KEY!, "base64").toString("utf8");


export async function getApp(installationId: number) {
    const octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: {
            appId: process.env.GITHUB_APP_ID!,
            privateKey: privateKey,
            installationId: installationId
        }
    })

    return octokit;
}