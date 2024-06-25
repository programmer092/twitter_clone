import { useCallback } from "react";
import { Auth } from "../firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import useTime from "../utils/useTime";
import toast from "react-hot-toast";

const useFacebookLogin = () => {
  const { LoginwithFacebook } = Auth();
  const { time } = useTime();

  const facebooklogin = useCallback(async () => {
    try {
      await LoginwithFacebook();
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          await updateDoc(userRef, {
            name: user.displayName,
            email: user.email,
          });
        } else {
          await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            followers: [],
            following: [],
            createdTweets: [],
            createdDate: time(Date.now()),
            retweets: [],
          });
        }
        toast.success("Successfully logged in!");
      } else {
        throw new Error("User is not available after login");
      }
    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
    }
  }, [LoginwithFacebook, time]);

  return { facebooklogin };
};

export default useFacebookLogin;
