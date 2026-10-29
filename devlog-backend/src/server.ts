import express from "express";
import register from "./register";
import login from "./login";
import loadProfile from "./loadProfile";

import cors from "cors";

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

app.get("/loadProfile", async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ")
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});