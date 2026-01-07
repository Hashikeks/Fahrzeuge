import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USER = "Hashikeks";
const GITHUB_REPO = "Fahrzeuge";
const GITHUB_BRANCH = "main";

// GET Fahrzeuge
app.get("/api/vehicles", async (req, res) => {
    try {
        const ghRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/vehiclesData.json`);
        const json = await ghRes.json();
        res.json(JSON.parse(Buffer.from(json.content, "base64").toString()));
    } catch (err) { res.status(500).json({ error: "Fehler beim Laden der Fahrzeuge" }); }
});

// GET Log
app.get("/api/log", async (req, res) => {
    try {
        const ghRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/adminLog.json`);
        const json = await ghRes.json();
        res.json(JSON.parse(Buffer.from(json.content, "base64").toString()));
    } catch (err) { res.status(500).json({ error: "Fehler beim Laden des Logs" }); }
});

// PUT Fahrzeuge
app.put("/api/vehicles", async (req, res) => {
    const { content, message, sha } = req.body;
    const ghRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/vehiclesData.json`, {
        method: "PUT",
        headers: { "Authorization": `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            message,
            content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
            branch: GITHUB_BRANCH,
            sha
        })
    });
    const data = await ghRes.json();
    res.json(data);
});

// PUT Log
app.put("/api/log", async (req, res) => {
    const { content, message, sha } = req.body;
    const ghRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/adminLog.json`, {
        method: "PUT",
        headers: { "Authorization": `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            message,
            content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
            branch: GITHUB_BRANCH,
            sha
        })
    });
    const data = await ghRes.json();
    res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
