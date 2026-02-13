import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ProposalProvider } from "./context/ProposalContext";
import { ToastProvider } from "./context/ToastContext.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
      <ProposalProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ProposalProvider>
  </StrictMode>
);
