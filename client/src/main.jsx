import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

// ROUTER
import { BrowserRouter as Router } from "react-router-dom";

// CONTEXT
import { StateContextProvider } from "./context";

// TOASTER
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <StateContextProvider>
        <ToastContainer />
        <App />
      </StateContextProvider>
    </Router>
  </React.StrictMode>
);
