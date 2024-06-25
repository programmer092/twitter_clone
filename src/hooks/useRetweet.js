
import { useCallback } from "react";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import useTime from "../utils/useTime";
import toast from "react-hot-toast";

const useRetweet = () => {
  const { time } = useTime();

  const Retweet = useCallback(
    async (tweetId, userId) => {
      const retweetRef = doc(db, "Retweets", tweetId);
      const tweetRef = doc(db, "Tweets", tweetId);
      const userRef = doc(db, "Users", userId);

      try {
        const retweetData = await getDoc(retweetRef);
        const timestamp = time(Date.now());

        if (retweetData.exists()) {
          await updateDoc(retweetRef, {
            retweets: arrayUnion({ userId, timestamp }),
          });
        } else {
          await setDoc(retweetRef, {
            retweets: [{ userId, timestamp }],
          });
        }

        const updatedRetweetData = await getDoc(retweetRef);
        const retweetArray = updatedRetweetData.data().retweets;
        const retweetsCount = retweetArray.length;

        await Promise.all([
          updateDoc(tweetRef, { retweets: retweetsCount }),
          updateDoc(userRef, { retweets: arrayUnion(tweetId) }),
        ]);

        toast.success("Retweet successful!");
      } catch (error) {
        toast.error(`Failed to retweet: ${error.message}`);
      }
    },
    [time],
  );

  return { Retweet };
};

export default useRetweet;
