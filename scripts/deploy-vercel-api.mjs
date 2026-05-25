import { readFile } from "node:fs/promises";

const token = process.env.VERCEL_TOKEN;
const teamId = process.env.VERCEL_TEAM_ID || "team_Fr6o95ec42bcjgSPQuBzh4yY";
const projectName = process.env.VERCEL_PROJECT_NAME || "local-five";
const projectId = process.env.VERCEL_PROJECT_ID || "prj_UdTGmsJkJsR5Iza7siDmBbrAwtJ6";

if (!token) {
  console.error("Set VERCEL_TOKEN before running this script.");
  process.exit(1);
}

const files = [
  "index.html",
  "styles.css",
  "app.js",
  "config.js",
  "vercel.json",
  "robots.txt",
  "social-card.svg",
  "data/seed/rankbites_seattle_seed_places.csv",
  "data/seed/rankbites_seed_sources.csv",
  "data/seed/rankbites_creator_rankings_matt_nick_normalized.csv",
  "data/seed/rankbites_creator_rankings_matt_nick_seed.json",
  "data/seed/rankbites_seed_data.js"
];

const payloadFiles = await Promise.all(
  files.map(async (file) => ({
    file,
    data: Buffer.from(await readFile(file)).toString("base64"),
    encoding: "base64"
  }))
);

const response = await fetch(
  `https://api.vercel.com/v13/deployments?teamId=${encodeURIComponent(teamId)}&forceNew=1&skipAutoDetectionConfirmation=1`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: projectName,
      project: projectId,
      target: "production",
      files: payloadFiles,
      projectSettings: {
        framework: null,
        buildCommand: null,
        devCommand: null,
        installCommand: null,
        outputDirectory: ".",
        rootDirectory: null
      }
    })
  }
);

const data = await response.json();

if (!response.ok) {
  console.error(JSON.stringify(data, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(data, null, 2));
