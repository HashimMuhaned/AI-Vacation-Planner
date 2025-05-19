// components/GoogleLoginButton.jsx
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/services/FirebaseConfig"; // Adjust the path to your firebase.js
import { useAuth } from "@/context/GoogleAuth"; // Adjust path if needed
import { showToast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { setLocalStorageItem } from "@/utils/localStorage";

export default function GoogleLoginButton({ onSuccess }) {
  // The useAuth hook is used to access the setUser function, which updates the application's authentication state with the logged-in user's information
  const { setUser } = useAuth();

  const handleLogin = async () => {
    try {
      // function from Firebase Authentication is used to initiate the Google sign-in process
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userProfile = {
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
        uid: user.uid,
      };
      // console.log("User profile:", userProfile);
      setUser(userProfile);
      setLocalStorageItem("user", JSON.stringify(userProfile));
      showToast("white", "green", "Login successful!");

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Google sign-in error:", error);
      showToast("white", "red", "Login failed!");
    }
  };

  return (
    <Button className="mt-5 w-full gap-3 items-center" onClick={handleLogin}>
      <FcGoogle className="w-5 h-7" />
      Sign in with Google
    </Button>
  );
}
