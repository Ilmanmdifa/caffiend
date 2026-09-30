import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

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
    const unsubscribed = onAuthStateChanged(auth, async (user) => {
      //if theres no user, empty the user state and return from this listener
      console.log("current user: ", user);
      setGlobalUser(user);
      if (!user) {
        setGlobalData({})
        console.log("No active user");
        return;
      }
      //if there is a user, then check if the user has data in the database, and if they do, then fetch said data and update the global state
      try {
        setIsLoading(true);
        setLoadError(null);

        //first we create a reference for the document (labelled json object), and then we get the doc, and then we snapshot it to see if there's anything there
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        let firebaseData = {};
        if (docSnap.exists()) {
          firebaseData = docSnap.data();
          console.log("Found user data", firebaseData);
        }
        setGlobalData(firebaseData || {});
      } catch {
        setLoadError("Couldn't load your data. Check your connection and retry.");
      } finally {
        setIsLoading(false);
      }
    });
    return unsubscribed;
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
