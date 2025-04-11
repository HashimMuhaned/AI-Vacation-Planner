// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from "@/utils/localStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getLocalStorageItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        removeLocalStorageItem("user"); // Optional: clear corrupted data
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
