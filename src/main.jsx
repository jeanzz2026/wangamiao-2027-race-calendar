import "./styles/app.css";
import "./styles/overrides.css";
import "./race-editor.js";
import "./analysis-embed.js";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import release from "../release.json";

window.__wamiaoBuildVersion = release.version;
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
const badge = document.createElement("div");
badge.className = "build-version";
badge.textContent = `v${release.version}`;
badge.title = `发布版本 ${release.version} · ${release.date}`;
document.body.append(badge);
