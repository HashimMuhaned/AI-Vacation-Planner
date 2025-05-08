import { StrictMode } from "react";
import "./index.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { Toaster } from "./components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/GoogleAuth";
import { LoadingProvider } from "./context/ViewTripLoadingContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLENT_ID}>
      <Toaster />
      <AuthProvider>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
