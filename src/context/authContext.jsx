import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

const Context = createContext();

const AuthContext = () => {
  return useContext(Context);
};

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [authuser, setauthuser] = useState(null);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, (User) => {
      if (User) {
        setauthuser(User);
        setisLoading(false);
      } else {
        setauthuser(null);
        setisLoading(true);
      }
    });
    return () => subscribe();
  }, []);

  const values = {
    authuser,
    setauthuser,
    isLoading,
    setisLoading,
  };
  return <Context.Provider value={values}>{children}</Context.Provider>;
};

export { AuthProvider, AuthContext };
