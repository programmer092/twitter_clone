import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const useHandlePost = () => {
  const HandlePost = async (id, tweetId) => {
    const Ref = doc(db, "Tweets", tweetId);
    const retweetRef = doc(db, "Retweets", tweetId);
    const userRef = doc(db, "Users", id);

    await deleteDoc(Ref);
    await deleteDoc(retweetRef);

    await updateDoc(userRef, {
      createdTweets: arrayRemove({ tweetId: tweetId }),
    });
  };

  return { HandlePost };
};
export default useHandlePost;
