import { useEffect, useState } from "react";
import { StateContext } from "../context/stateContext";
import { doc, getDoc, onSnapshot, collection, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";

const useGetRetweetPost = () => {
  const { ID } = StateContext();
  const [retweetPost, setretweetPost] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const tweetsRef = query(collection(db, "Tweets"));
    const unsubscribe = onSnapshot(tweetsRef, async () => {
      const getRetweetPost = async () => {
        const userRef = doc(db, "Users", ID);
        setloading(true);
        try {
          const user = await getDoc(userRef);
          const postRetweet = user.data()?.retweets || null;

          const fetchUserData = async (id, tweet) => {
            let comments = [];
            const userRef = doc(db, "Users", tweet.author);
            const userData = await getDoc(userRef);
            if (tweet.commenters.length > 0) {
              comments = tweet.commenters.map((id) => id.userId);
            } else {
              comments = [];
            }
            if (userData.exists()) {
              return {
                id: id,
                ...tweet,
                commentArray: comments,
                user: userData.data(),
              };
            } else {
              return { id: id, ...tweet, user: null };
            }
          };

          const fetchTweet = async (tweetId) => {
            const Tweet = await getDoc(doc(db, "Tweets", tweetId));
            if (Tweet.exists()) {
              const TweetandUser = await fetchUserData(tweetId, Tweet.data());
              return TweetandUser;
            } else {
              return { id: tweetId, message: "Tweet not found" };
            }
          };

          if (postRetweet !== null) {
            const retweetPostArray = await Promise.all(
              postRetweet.map((post) => fetchTweet(post)),
            );
            setretweetPost(retweetPostArray);
            setloading(false);
          } else {
            setretweetPost([]);
            setloading(false);
          }
        } catch (error) {
          toast.error(error.message);
          setloading(false);
        }
      };

      getRetweetPost();
    });

    return () => unsubscribe();
  }, [ID]);

  return { loading, retweetPost };
};

export default useGetRetweetPost;
