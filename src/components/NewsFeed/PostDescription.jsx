import { doc, getDoc, onSnapshot } from "firebase/firestore";

import {
  FaRegComment,
  FaComment,
  FaRegHeart,
  FaHeart,
  FaArrowLeft,
} from "react-icons/fa";
import { FaArrowRightArrowLeft, FaRetweet } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import useLikers from "../../hooks/useLikers";
import { AuthContext } from "../../context/authContext";
import toast from "react-hot-toast";
import { StateContext } from "../../context/stateContext";
import useIntegrateUser from "../../hooks/useIntegrateUser";
import ReactPlayer from "react-player/lazy";
import useHandleLike from "../../hooks/useHandleLike";
import useRetweet from "../../hooks/useRetweet";
import useStoreNotifications from "../../hooks/useStoreNotifications";
import CommentModal from "../Modal/CommentModal";
import useHandlePost from "../../hooks/useHandlePost";

export default function PostDescription() {
  const [tweets, settweets] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setLikers } = useLikers();
  const { authuser } = AuthContext();
  const { Retweet } = useRetweet();
  const {
    setactive,
    selectedTweetId,
    setSelectedTweetId,
    user,
    setID,
    setprofilecomp,
  } = StateContext();
  const { Comments, Loading } = useIntegrateUser();
  const { UnLike } = useHandleLike();
  const { StoreNotifications } = useStoreNotifications();
  const { HandlePost } = useHandlePost();
  useEffect(() => {
    const docRef = doc(db, "Tweets", selectedTweetId);

    //runs if there is anychange in tweetId document
    const unsubscribe = onSnapshot(docRef, async (snapshot) => {
      try {
        if (snapshot.exists()) {
          const Data = snapshot.data();
          const tweet = { ...Data, id: snapshot.id };

          //fetch user data
          const fetchUserData = async (tweet, commentArray) => {
            const userRef = doc(db, "Users", tweet.author);
            const userData = await getDoc(userRef);
            if (userData.exists()) {
              return {
                ...tweet,
                user: userData.data(),
                commentArray: commentArray,
              };
            } else {
              return { ...tweet, user: null };
            }
          };
          let comments = [];
          if (Data.commenters.length > 0) {
            comments = Data.commenters.map((id) => id.userId);
          }
          const tweetwithuser = await fetchUserData(tweet, comments);
          settweets(tweetwithuser);
          setLoading(false);
        } else {
          return;
        }
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [selectedTweetId]);

  const handleLike = async (tweetId, author) => {
    await setLikers(tweetId, authuser.uid);
    if (author !== authuser.uid) {
      await StoreNotifications(author, "like", `${user.name} liked your post.`);
    }
  };

  const handleComment = async (tweetId) => {
    await setSelectedTweetId(tweetId);
    document.getElementById("commentModal").showModal();
  };

  const handleRetweet = async (tweetId, author) => {
    await Retweet(tweetId, authuser.uid);
    if (author !== authuser.uid) {
      await StoreNotifications(
        author,
        "retweet",
        `${user.name} retweeted your post.`,
      );
    }
  };

  const handleUnLike = async (tweetId) => {
    await UnLike(tweetId);
  };

  const handleCommented = async (e) => {
    e.preventDefault();
    toast("Already Commented!", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };
  const handleRetweeted = async (e) => {
    e.preventDefault();
    toast("Already Retweeted!", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };
  const handleTranslate = async (e) => {
    e.preventDefault();
    toast("Translate Feature Not Working!", {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handleOtherUserProfile = (id) => {
    setID(id);
    setprofilecomp("posts");
    setactive("othersprofile");
  };

  const handlePost = (id, tweetId) => {
    if (id === authuser.uid) {
      document.getElementById("more").showModal();

      const deletePost = document.getElementById("delete");

      deletePost.onclick = async function () {
        await HandlePost(id, tweetId);
        setactive("home");
        document.getElementById("more").close();
      };
    } else {
      return;
    }
  };

  return (
    <>
      <div className="relative flex h-full w-full flex-col items-center overflow-y-scroll border-l border-r border-gray-800 p-0 sm:p-4">
        <div className="absolute left-0 top-0 z-10 flex w-full items-center border-b border-gray-700 bg-black p-4">
          <button className="mr-4 text-white" onClick={() => setactive("home")}>
            <FaArrowLeft size="1em" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">POST</h1>
          </div>
        </div>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="loader">Loading...</div>
          </div>
        ) : (
          <div className="mt-16 w-full">
            <div
              key={tweets.id}
              className="flex border-b border-gray-800 bg-gray-900 pt-1 sm:p-4"
            >
              <img
                src={
                  tweets.user?.profileImage || "https://via.placeholder.com/48"
                }
                alt="Avatar"
                className="h-10 w-10 rounded-full sm:h-12 sm:w-12"
                onClick={() => handleOtherUserProfile(tweets.author)}
              />
              <div className="ml-4 flex-1 text-white">
                <div className="flex items-center">
                  <span
                    className="text-sm font-bold sm:text-xl"
                    onClick={() => handleOtherUserProfile(tweets.author)}
                  >
                    {tweets.user.name}
                  </span>
                  {tweets.user.username && (
                    <span className="ml-2 text-xs text-gray-500 sm:text-lg">
                      @{tweets.user.username}
                    </span>
                  )}
                  <span className="ml-2 text-xs text-gray-500 sm:text-lg">
                    {tweets.formattedTime}
                  </span>
                  <button
                    className="ml-auto text-xs sm:text-lg"
                    onClick={() => handlePost(tweets.author, tweets.id)}
                  >
                    <IoIosMore />
                  </button>
                </div>
                <p className="mt-2 text-sm sm:text-lg">{tweets.content}</p>
                {tweets.file && tweets.type === "image" && (
                  <div>
                    <img
                      src={tweets.file}
                      alt="Tweet"
                      className="mt-2 rounded-lg"
                    />
                  </div>
                )}
                {tweets.file && tweets.type === "video" && (
                  <div className="mt-2">
                    <ReactPlayer
                      url={tweets.file}
                      controls
                      width="100%"
                      height="100%"
                      className="w-full shadow-lg"
                      playing={false}
                    />
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  {tweets.likers.includes(authuser.uid) && (
                    <div className="flex flex-row gap-1">
                      <button
                        className="flex items-center space-x-1"
                        onClick={() => handleUnLike(tweets.id)}
                      >
                        <FaHeart color="red" size={20} />
                      </button>
                      {tweets.likes}
                    </div>
                  )}
                  {!tweets.likers.includes(authuser.uid) && (
                    <div className="flex flex-row gap-1">
                      <button
                        className="flex items-center space-x-1"
                        onClick={() => handleLike(tweets.id, tweets.author)}
                      >
                        <FaRegHeart color="gray" size={20} />
                      </button>
                      {tweets.likes}
                    </div>
                  )}

                  {tweets.commentArray.includes(authuser.uid) && (
                    <div className="flex flex-row gap-1">
                      <button
                        className="flex items-center space-x-1"
                        onClick={handleCommented}
                      >
                        <FaComment color="blue" size={20} />
                      </button>
                      {tweets.comment}
                    </div>
                  )}
                  {!tweets.commentArray.includes(authuser.uid) && (
                    <div className="flex flex-row gap-1">
                      <button
                        className="flex items-center space-x-1"
                        onClick={() => handleComment(tweets.id)}
                      >
                        <FaRegComment color="gray" size={20} />
                      </button>
                      {tweets.comment}
                    </div>
                  )}

                  {user?.retweets.includes(tweets.id) && (
                    <div className="flex flex-row gap-1">
                      <button
                        className="flex items-center space-x-1"
                        onClick={handleRetweeted}
                      >
                        <FaRetweet color="green" size={20} />
                      </button>
                      {tweets?.retweets || 0}
                    </div>
                  )}
                  {!user?.retweets.includes(tweets.id) && (
                    <div className="flex flex-row gap-1">
                      <button
                        className="flex items-center space-x-1"
                        onClick={() => handleRetweet(tweets.id, tweets.author)}
                      >
                        <FaRetweet color="gray" size={20} />
                      </button>
                      {tweets?.retweets || 0}
                    </div>
                  )}
                  <div>
                    <button
                      className="flex items-center space-x-1"
                      onClick={handleTranslate}
                    >
                      <FaArrowRightArrowLeft />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {!Loading &&
              Comments.map((Comment) => (
                <div key={Comment.userId}>
                  {Comment.user !== null && (
                    <div
                      // key={Comment.userId}
                      className="mt-1 flex flex-col border-b border-gray-700 p-1 sm:mt-4"
                    >
                      <div className="mt-1 flex flex-row sm:mt-4 sm:space-x-3">
                        <img
                          src={Comment.user.profileImage}
                          className="h-8 w-8 rounded-full sm:h-9 sm:w-9"
                          onClick={() => handleOtherUserProfile(Comment.userId)}
                        />
                        <div className="flex items-center">
                          <span
                            className="ml-1 text-xs font-bold sm:text-lg"
                            onClick={() =>
                              handleOtherUserProfile(Comment.userId)
                            }
                          >
                            {Comment.user.name}
                          </span>
                          <span className="ml-1 text-xs text-gray-500 sm:ml-2 sm:text-lg">
                            @{Comment.user.username}
                          </span>
                          <span className="ml-1 text-xs text-gray-500 sm:ml-2 sm:text-lg">
                            {Comment.time}
                          </span>
                        </div>
                      </div>
                      <div className="space-x-5 p-2">
                        <p className="text-sm">{Comment.comment}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* modal */}
      <dialog id="commentModal" className="modal modal-middle">
        <div className="modal-box w-full bg-gray-900 md:w-2/4">
          <form method="dialog">
            <CommentModal />
            <button className="btn btn-circle btn-ghost btn-sm absolute right-1 top-1">
              ✕
            </button>
          </form>
        </div>
      </dialog>

      {/* modal  */}
      <dialog id="more" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <button id="delete" className="h-full w-full">
            Delete the post
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
