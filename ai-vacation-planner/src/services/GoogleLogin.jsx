// components/GoogleLoginButton.jsx
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../context/GoogleAuth"; // adjust path
import { showToast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { setLocalStorageItem } from "@/utils/localStorage";

export default function GoogleLoginButton({ onSuccess }) {
  const { setUser } = useAuth();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );

        const userProfile = response.data;
        setLocalStorageItem("user", JSON.stringify(userProfile));
        setUser(userProfile);
        showToast("white", "green", "Login successful!");
        if (onSuccess) onSuccess(); // ✅ Closes dialog
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },
    onError: (error) => {
      console.log("Login failed!", error);
    },
  });

  return (
    <Button className="mt-5 w-full gap-3 items-center" onClick={login}>
      <FcGoogle className="w-5 h-7" />
      Sign in with Google
    </Button>
  );
}
