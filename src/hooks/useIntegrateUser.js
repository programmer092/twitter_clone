import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { StateContext } from "../context/stateContext";

const useIntegrateUser = () => {
  const [Comments, setComments] = useState(null);
  const [Loading, setLoading] = useState(true);
  const { selectedTweetId } = StateContext();

  useEffect(() => {
    const docRef = doc(db, "Tweets", selectedTweetId);

    //runs if there is anychange in tweetId document
    const unsubscribe = onSnapshot(docRef, async (snapshot) => {
      if (snapshot.exists()) {
        const tweetsData = snapshot.data();
        const commentArray = tweetsData.commenters;
        // console.log(commentArray);

        if (!commentArray) {
          setLoading(false);
          return setComments([]);
        }

        //fetch user data
        const fetchUserData = async (comment) => {
          const userRef = doc(db, "Users", comment.userId);
          const userData = await getDoc(userRef);
          if (userData.exists()) {
            return userData.data();
          } else {
            return null;
          }
        };

        const commentWithUserPromises = commentArray.map(async (comment) => {
          const userData = await fetchUserData(comment);
          return {
            ...comment,
            user: userData,
          };
        });
        const commentsWithUser = await Promise.all(commentWithUserPromises);
        setComments(commentsWithUser);
        setLoading(false);
      } else {
        setLoading(false);
        return setComments([]);
      }
    });

    return () => unsubscribe();
  }, [selectedTweetId]);

  return { Comments, Loading };
};

export default useIntegrateUser;
