
import { useCallback } from "react";
import { AuthContext } from "../context/authContext";
import { doc, getDoc, arrayRemove, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";

const useHandleLike = () => {
  const { authuser } = AuthContext();

  const UnLike = useCallback(
    async (tweetId) => {
      const userRef = doc(db, "Users", authuser.uid);
      const tweetRef = doc(db, "Tweets", tweetId);

      try {
        const [userDoc, tweetDoc] = await Promise.all([
          getDoc(userRef),
          getDoc(tweetRef),
        ]);

        if (userDoc.exists()) {
          await updateDoc(userRef, {
            likedPost: arrayRemove(tweetId),
          });
        }

        if (tweetDoc.exists()) {
          await updateDoc(tweetRef, {
            likers: arrayRemove(authuser.uid),
          });

          const updatedTweetDoc = await getDoc(tweetRef);
          const likersArray = updatedTweetDoc.data().likers;
          const likesCount = likersArray.length;

          await updateDoc(tweetRef, {
            likes: likesCount,
          });
        }
      } catch (error) {
        toast.error(`Error unliking tweet: ${error.message}`);
      }
    },
    [authuser.uid],
  );

  return { UnLike };
};

export default useHandleLike;
