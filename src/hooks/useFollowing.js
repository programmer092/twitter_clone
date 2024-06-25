import {
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { AuthContext } from "../context/authContext";

const useFollowing = () => {
  const { authuser } = AuthContext();

  const Follow = async (id) => {
    const userRef = doc(db, "Users", id);
    const myRef = doc(db, "Users", authuser.uid);

    const myData = await getDoc(myRef);
    const userData = await getDoc(userRef);
    if (myData.exists()) {
      await updateDoc(myRef, {
        following: arrayUnion(id),
      });
    }

    if (userData.exists()) {
      await updateDoc(userRef, {
        followers: arrayUnion(authuser.uid),
      });
    }
  };

  const UnFollow = async (id) => {
    const userRef = doc(db, "Users", id);
    const myRef = doc(db, "Users", authuser.uid);

    const myData = await getDoc(myRef);
    const userData = await getDoc(userRef);

    if (myData.exists()) {
      await updateDoc(myRef, {
        following: arrayRemove(id),
      });
    }

    if (userData.exists()) {
      await updateDoc(userRef, {
        followers: arrayRemove(authuser.uid),
      });
    }
  };

  return { Follow, UnFollow };
};

export default useFollowing;
