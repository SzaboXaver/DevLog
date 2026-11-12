import { App } from "octokit";

const privateKey = Buffer.from(process.env.GITHUB_PRIVATE_KEY!, "base64").toString("utf8");


const app = new App({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: privateKey
});

export async function getApp(installationId: number) {
    const octokit = await app.getInstallationOctokit(
        installationId
    );

    return octokit;
}