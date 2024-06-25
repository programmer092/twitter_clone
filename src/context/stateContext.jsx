import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const stateContext = createContext();

const StateContext = () => {
  return useContext(stateContext);
};

// eslint-disable-next-line react/prop-types
const StateProvider = ({ children }) => {
  const [active, setactive] = useState("home");
  const [profilecomp, setprofilecomp] = useState("posts");
  const [selectedTweetId, setSelectedTweetId] = useState(null);
  const [user, setuser] = useState([]);
  const [otheruser, setotheruser] = useState([]);
  const [loading, setloading] = useState(true);
  const { authuser } = AuthContext();
  const [ID, setID] = useState("");

  useEffect(() => {
    setloading(true);
    if (authuser) {
      const docRef = doc(db, "Users", authuser.uid);

      //runs if there is anychange in authuserId document
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        const Data = snapshot.data();
        const UserInfo = { ...Data, id: snapshot.id };
        setuser(UserInfo);
        setloading(false);
      });

      setID(authuser.uid);

      return () => unsubscribe();
    }
  }, [authuser]);

  useEffect(() => {
    if (ID) {
      if (authuser && ID === authuser.uid) {
        setotheruser(user);
      } else {
        setloading(true);
        const docRef = doc(db, "Users", ID);

        // Runs if there is any change in the document with the given ID
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          const Data = snapshot.data();
          const OtherUserInfo = { ...Data, id: snapshot.id };
          setotheruser(OtherUserInfo);
          setloading(false);
        });

        return () => unsubscribe();
      }
    }
  }, [ID, user, authuser]);

  const value = {
    active,
    setactive,
    selectedTweetId,
    setSelectedTweetId,
    user,
    setuser,
    loading,
    profilecomp,
    setprofilecomp,
    otheruser,
    setotheruser,
    ID,
    setID,
  };

  return (
    <stateContext.Provider value={value}>{children}</stateContext.Provider>
  );
};

export { StateContext, StateProvider };
