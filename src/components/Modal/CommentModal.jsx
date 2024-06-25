import { useState, useEffect } from "react";
import useCommenters from "../../hooks/useCommenters";
import { StateContext } from "../../context/stateContext";
import { AuthContext } from "../../context/authContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import useStoreNotifications from "../../hooks/useStoreNotifications";
import toast from "react-hot-toast";

export default function CommentModal() {
  const [comment, setComment] = useState("");
  const { setCommenters } = useCommenters();
  const { authuser } = AuthContext();
  const { selectedTweetId, user } = StateContext();
  const [author, setauthor] = useState("");
  const { StoreNotifications } = useStoreNotifications();

  useEffect(() => {
    const getAuthorId = async () => {
      if (selectedTweetId) {
        const Data = await getDoc(doc(db, "Tweets", selectedTweetId));
        if (!Data.exists()) {
          return;
        } else {
          const Info = Data.data();
          const id = Info?.author;
          setauthor(id);
        }
      }
    };

    getAuthorId();
  }, [selectedTweetId]);
  const handleCommentSubmit = async () => {
    if (comment.trim() !== "") {
      await setCommenters(selectedTweetId, comment, authuser.uid);
      await StoreNotifications(
        author,
        "comment",
        `${user.name} commented on your post.`,
      );
      setComment("");
      document.getElementById("commentModal").close();
    } else {
      toast.error("Comment can't be empty!");
    }
  };

  return (
    <>
      <div className="h-full w-full max-w-md rounded-lg bg-gray-900 p-4 text-white">
        <div className="mb-4 flex items-center">
          <h1 className="text-xl font-bold">Reply</h1>
        </div>
        <div className="mb-4 flex items-center">
          <img
            src={user.profileImage}
            alt="Avatar"
            className="h-12 w-12 rounded-full"
          />
          <div className="ml-4">
            <p className="font-bold">{user.name}</p>
            <p className="text-gray-500">@{user.username}</p>
          </div>
        </div>
        <textarea
          className="w-full resize-none rounded-lg bg-gray-800 p-2 focus:outline-none"
          rows="3"
          placeholder="Post your reply"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="mt-2 flex justify-end">
          <button
            className="rounded-lg bg-blue-500 px-4 py-2 text-white"
            onClick={handleCommentSubmit}
          >
            Reply
          </button>
        </div>
      </div>
    </>
  );
}
