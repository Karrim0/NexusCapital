import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://nexuscapitalredsea.com/api";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
