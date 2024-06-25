
import { useCallback } from "react";
import { AuthContext } from "../context/authContext";
import {
  addDoc,
  arrayUnion,
  collection,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import toast from "react-hot-toast";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useTime from "../utils/useTime";

const useStoretweet = () => {
  const { time } = useTime();
  const { authuser } = AuthContext();

  const storetweet = useCallback(
    async (content, file) => {
      const mediaRef = doc(db, "Medias", authuser.uid);

      try {
        const newTweetDoc = await addDoc(collection(db, "Tweets"), {
          author: authuser.uid,
          content: content,
          timestamp: serverTimestamp(),
          formattedTime: time(Date.now()),
          likes: 0,
          comment: 0,
          likers: [],
          commenters: [],
        });

        let fileURL = null;
        let fileType = null;

        if (file) {
          const storageRef = ref(storage, `tweetFiles/${newTweetDoc.id}`);
          await uploadBytes(storageRef, file);
          fileURL = await getDownloadURL(storageRef);
          fileType = file.type.startsWith("image") ? "image" : "video";

          await updateDoc(newTweetDoc, {
            file: fileURL,
            type: fileType,
          });

          const mediaDoc = await getDoc(mediaRef);
          const mediaData = mediaDoc.exists() ? mediaDoc.data() : { files: [] };
          await setDoc(mediaRef, {
            files: arrayUnion({
              file: fileURL,
              type: fileType,
              ...mediaData.files,
            }),
          });
        }

        await updateDoc(doc(db, "Users", authuser.uid), {
          createdTweets: arrayUnion({ tweetId: newTweetDoc.id }),
        });

        toast.success("Tweet posted successfully!");
      } catch (error) {
        toast.error(`Failed to post tweet: ${error.message}`);
        console.error("Error posting tweet:", error);
      }
    },
    [authuser.uid, time],
  );

  return { storetweet };
};

export default useStoretweet;
