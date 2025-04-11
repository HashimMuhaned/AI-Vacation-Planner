import React, { useState } from "react";
import Logo from "/logo.svg";
import { Button } from "@/components/ui/button";
import { removeLocalStorageItem } from "@/utils/localStorage"; // adjust path as needed
import { showToast } from "@/components/ui/sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/GoogleAuth";
import LoginDialog from "./Dialog";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Header = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setLoading(true);
    googleLogout();
    removeLocalStorageItem("user");
    setUser(null);
    showToast("white", "green", "Logged out successfully");
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-20">
      <Link to={"/"}>
        <img src={Logo} alt="logo" height={40} width={40} />
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-5">
            <Button variant="outline" className="rounded-full">
              <Link to="/create-trip">+ Create Trip</Link>
            </Button>
            <Button variant="outline" className="rounded-full">
              <Link to="/my-trips">My Trips</Link>
            </Button>
            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  alt="user"
                  height={35}
                  width={35}
                  className="rounded-full cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-2 p-2">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-sm font-semibold">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin" />
                      </div>
                    ) : (
                      "Logout"
                    )}
                  </Button>
                  <Button variant="outline" className="w-full">
                    Switch Account
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button
            variant="outline"
            className="text-black"
            onClick={() => setOpenDialog(true)}
          >
            Login
          </Button>
        )}
      </div>
      <LoginDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </div>
  );
};

export default Header;
