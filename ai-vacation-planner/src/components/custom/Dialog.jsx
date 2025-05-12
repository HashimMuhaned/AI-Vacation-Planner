// components/LoginDialog.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import GoogleLogin from "@/services/GoogleLogin";

export default function LoginDialog({
  openDialog,
  setOpenDialog,
  mode = "login",
}) {
  const isSwitching = mode === "switch";

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSwitching ? "Switch Account" : "Login"}</DialogTitle>
          <h2 className="font-bold text-lg mt-7">
            {isSwitching
              ? "Sign in with another Google account"
              : "Sign in with Google"}
          </h2>
          <p>
            {isSwitching
              ? "Switch to a different Google account to continue securely."
              : "Sign in to the app with Google Authentication securely."}
          </p>
          <DialogDescription>
            <GoogleLogin onSuccess={() => setOpenDialog(false)} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
