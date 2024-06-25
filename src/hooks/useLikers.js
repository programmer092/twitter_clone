
import {
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { useCallback } from "react";

const useLikers = () => {
  const setLikers = useCallback(async (tweetId, userId) => {
    const tweetRef = doc(db, "Tweets", tweetId);
    const userRef = doc(db, "Users", userId);
    const batch = writeBatch(db);

    try {
      batch.update(tweetRef, {
        likers: arrayUnion(userId),
      });

      batch.update(userRef, {
        likedPost: arrayUnion(tweetId),
      });

      await batch.commit();

      const Data = await getDoc(tweetRef);
      const likersArray = Data.data().likers;
      const length = likersArray.length;

      await updateDoc(tweetRef, {
        likes: length,
      });
      toast.success("Liked successfully");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  return { setLikers };
};

export default useLikers;
