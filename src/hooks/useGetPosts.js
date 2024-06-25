import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, query, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { StateContext } from "../context/stateContext";

const useGetPost = () => {
  const { ID } = StateContext();
  const [loading, setloading] = useState(true);
  const [post, setpost] = useState([]);
  useEffect(() => {
    const tweetsRef = query(collection(db, "Tweets"));
    const unsubscribe = onSnapshot(tweetsRef, async () => {
      const getPost = async () => {
        const userRef = doc(db, "Users", ID);
        setloading(true);
        try {
          const Data = await getDoc(userRef);
          const userData = Data.data();

          const fetchTweet = async (tweetId) => {
            let comments = [];
            const Tweet = await getDoc(doc(db, "Tweets", tweetId));
            if (Tweet.exists()) {
              if (Tweet.data().commenters.length > 0) {
                comments = Tweet.data().commenters.map((id) => id.userId);
              } else {
                comments = [];
              }
              return {
                id: tweetId,
                ...Tweet.data(),
                commentArray: comments,
                user: userData,
              };
            } else {
              return { id: tweetId, message: "Tweet not found" };
            }
          };

          const tweetsArray = await Promise.all(
            userData.createdTweets.map((tweet) => fetchTweet(tweet.tweetId)),
          );

          setpost(tweetsArray);
          setloading(false);
        } catch (error) {
          toast.error(error.message);
          setloading(false);
        }
      };

      getPost();
    });

    return () => unsubscribe();
  }, [ID]);

  return { loading, post };
};

export default useGetPost;
