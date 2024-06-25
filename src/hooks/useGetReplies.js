import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { StateContext } from "../context/stateContext";

const useGetReplies = () => {
  const { ID } = StateContext();
  const [repliedPost, setrepliedPost] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const tweetsRef = query(collection(db, "Tweets"));
    const unsubscribe = onSnapshot(tweetsRef, async () => {
      const getRepliedPost = async () => {
        const tweetquery = query(
          collection(db, "Tweets"),
          orderBy("timestamp", "desc"),
        );
        setloading(true);
        try {
          const tweets = await getDocs(tweetquery);

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

          if (tweets.empty) {
            setrepliedPost([]);
            setloading(false);
          } else {
            const retweetPostArray = [];
            for (const doc of tweets.docs) {
              const tweetsData = doc.data();
              const mycomment = tweetsData.commenters.find((comment) => {
                return comment.userId === ID;
              });
              if (mycomment) {
                const userInfo = await fetchUserData(doc.id, tweetsData);
                retweetPostArray.push({ ...userInfo, mycomment });
              }
            }
            setrepliedPost(retweetPostArray);
            setloading(false);
          }
        } catch (error) {
          toast.error(error.message);

          setloading(false);
        }
      };

      getRepliedPost();
    });

    return () => unsubscribe();
  }, [ID]);

  return { loading, repliedPost };
};

export default useGetReplies;
