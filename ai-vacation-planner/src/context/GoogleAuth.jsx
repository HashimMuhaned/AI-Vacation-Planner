// // context/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";
// import {
//   getLocalStorageItem,
//   removeLocalStorageItem,
// } from "@/utils/localStorage";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = getLocalStorageItem("user");
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error("Error parsing user data from localStorage:", error);
//         removeLocalStorageItem("user"); // Optional: clear corrupted data
//       }
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/services/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged function is provided by Firebase Authentication and is used to monitor the authentication state of the user.
    const unsubscribe = onAuthStateChanged(
      auth, // auth: The Firebase authentication instance.
      (firebaseUser) => {
        // (firebaseUser) A callback function that receives the firebaseUser object whenever the authentication state changes.
        if (firebaseUser) {
          const userProfile = {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            picture: firebaseUser.photoURL,
            uid: firebaseUser.uid,
          };
          setUser(userProfile);
        } else {
          setUser(null);
        }
        setAuthLoading(false); // ✅ Mark auth as resolved
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
