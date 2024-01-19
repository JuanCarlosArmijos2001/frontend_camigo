import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/styles/layouts/index.css";
import Admin from "./layouts/Admin";
import { SesionUsuarioContextProvider } from "../src/context/SesionUsuarioContext";
//import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <SesionUsuarioContextProvider>
      <Admin />
    </SesionUsuarioContextProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
