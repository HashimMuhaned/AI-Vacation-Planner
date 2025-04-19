// components/LoginDialog.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import GoogleLogin from "@/services/GoogleLogin";

export default function LoginDialog({ openDialog, setOpenDialog }) {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <h2 className="font-bold text-lg mt-7">Sign in with Google</h2>
          <p>Sign in to the app with Google Authentication securely</p>
          <DialogDescription>
            <GoogleLogin onSuccess={() => setOpenDialog(false)} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
