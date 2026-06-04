import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
// Self-hosted fonts (bundled) — no external request, so the app's typography
// works fully offline as a PWA.
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/outfit";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </HashRouter>
  </React.StrictMode>
);
