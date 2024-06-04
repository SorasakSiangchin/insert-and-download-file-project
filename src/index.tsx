import React from "react";
import { createRoot } from "react-dom/client";
import { Main } from "./main";
import "./index.css";

const container = document.querySelector("#root");
const root = container ? createRoot(container) : null;

root?.render(<Main />);
