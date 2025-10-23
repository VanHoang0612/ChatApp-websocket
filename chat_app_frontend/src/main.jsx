import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./config/AppRoutes.jsx";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "./context/ChatProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster position="top right" />
    <ChatProvider>
      <AppRoutes />
    </ChatProvider>
  </BrowserRouter>
);
