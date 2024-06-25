import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, query, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { StateContext } from "../context/stateContext";

const useGetLikedPost = () => {
  const { ID } = StateContext();
  const [LikedPost, setLikedPost] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const tweetsRef = query(collection(db, "Tweets"));
    const unsubscribe = onSnapshot(tweetsRef, async () => {
      const getLikedPost = async () => {
        const userRef = doc(db, "Users", ID);
        setloading(true);
        try {
          const user = await getDoc(userRef);
          const postLiked = user.data()?.likedPost || null;
          let UserData = null;

          const fetchTweet = async (tweetId) => {
            let comments = [];
            const Tweet = await getDoc(doc(db, "Tweets", tweetId));
            if (Tweet.exists()) {
              const User = await getDoc(doc(db, "Users", Tweet.data().author));
              if (User.exists()) {
                UserData = User.data();
              } else {
                UserData = null;
              }

              if (Tweet.data().commenters.length > 0) {
                comments = Tweet.data().commenters.map((id) => id.userId);
              } else {
                comments = [];
              }
              return {
                id: tweetId,
                ...Tweet.data(),
                commentArray: comments,
                user: UserData,
              };
            } else {
              return { id: tweetId, message: "Tweet not found" };
            }
          };

          if (postLiked !== null) {
            const likedPostArray = await Promise.all(
              postLiked.map((post) => fetchTweet(post)),
            );
            setLikedPost(likedPostArray);
            setloading(false);
          } else {
            setLikedPost([]);
            setloading(false);
          }
        } catch (error) {
          toast.error(error.message);
          setloading(false);
        }
      };

      getLikedPost();
    });

    return () => unsubscribe();
  }, [ID]);

  return { loading, LikedPost };
};

export default useGetLikedPost;
