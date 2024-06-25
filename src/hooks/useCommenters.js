import { updateDoc, arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import useTime from "../utils/useTime";

const useCommenters = () => {
  const { time } = useTime();
  const setCommenters = async (tweetId, comment, userId) => {
    const tweetRef = doc(db, "Tweets", tweetId);
    const userRef = doc(db, "Users", userId);
    try {
      await updateDoc(tweetRef, {
        commenters: arrayUnion({ userId, comment, time: time(Date.now()) }),
      });

      const Data = await getDoc(tweetRef);
      const commentersArray = Data.data().commenters;
      const length = commentersArray.length;

      await updateDoc(tweetRef, {
        comment: length,
      });

      const user = await getDoc(userRef);
      if (user.exists()) {
        if (!user.commentedTweets) {
          await setDoc(
            userRef,
            {
              commentedTweets: [tweetId],
            },
            { merge: true },
          );
        } else {
          await updateDoc(userRef, {
            commentedTweets: arrayUnion(tweetId),
          });
        }
      }
      toast.success("Commented successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return { setCommenters };
};

export default useCommenters;
