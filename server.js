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

// Fahrzeuge speichern
app.put("/api/vehicles", async (req, res) => {
  const { content, message, sha } = req.body;
  try {
    const githubRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/vehiclesData.json`, {
      method: "PUT",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
        branch: GITHUB_BRANCH,
        sha,
      }),
    });
    const data = await githubRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Speichern der Fahrzeuge" });
  }
});

// Admin Log speichern
app.put("/api/log", async (req, res) => {
  const { content, message, sha } = req.body;
  try {
    const githubRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/adminLog.json`, {
      method: "PUT",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
        branch: GITHUB_BRANCH,
        sha,
      }),
    });
    const data = await githubRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Speichern des Logs" });
  }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
