import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const { children } = props;
  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function logout() {
    setGlobalUser(null);
    setGlobalData({});
    return signOut(auth);
  }

  const value = {
    globalUser,
    globalData,
    setGlobalData,
    isLoading,
    loadError,
    signup,
    login,
    logout,
    resetPassword,
  };

  useEffect(() => {
    // Track the data listener so we can detach it whenever the auth
    // state changes (logout, or a different user signing in).
    let unsubscribeData = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Detach any previous data listener before switching users.
      if (unsubscribeData) {
        unsubscribeData();
        unsubscribeData = null;
      }

      setGlobalUser(user);
      if (!user) {
        setGlobalData({});
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      // Subscribe to live updates on the user's document. Writes from any
      // tab or device now flow back into the app automatically, and local
      // optimistic changes are confirmed or corrected by the server.
      const docRef = doc(db, "users", user.uid);
      unsubscribeData = onSnapshot(
        docRef,
        (docSnap) => {
          let firebaseData = {};
          if (docSnap.exists()) {
            firebaseData = docSnap.data();
          }
          setGlobalData(firebaseData || {});
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
          setLoadError("Couldn't load your data. Check your connection and retry.");
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeData) {
        unsubscribeData();
      }
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
