import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { FaRegComment, FaComment, FaRegHeart, FaHeart } from "react-icons/fa";
import { FaArrowRightArrowLeft, FaRetweet } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import PostSection from "./PostSection";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import useLikers from "../../hooks/useLikers";
import useRetweet from "../../hooks/useRetweet";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-hot-toast";
import { StateContext } from "../../context/stateContext";
import CommentModal from "../Modal/CommentModal";
import ReactPlayer from "react-player/lazy";
import useHandleLike from "../../hooks/useHandleLike";
import useStoreNotifications from "../../hooks/useStoreNotifications";
import useHandlePost from "../../hooks/useHandlePost";
import { useMemo } from "react";

export default function Feed() {
  const [tweets, settweets] = useState([]);
  const [allpost, setallpost] = useState([]);
  const [feed, setfeed] = useState("foryou");
  const { setLikers } = useLikers();
  const { Retweet } = useRetweet();
  const { authuser } = AuthContext();
  const { setactive, setSelectedTweetId, user, setID, setprofilecomp } =
    StateContext();
  const { UnLike } = useHandleLike();
  const { StoreNotifications } = useStoreNotifications();
  const { HandlePost } = useHandlePost();

  // useEffect(() => {
  //   const tweetquery = query(
  //     collection(db, "Tweets"),
  //     orderBy("timestamp", "desc"),
  //   );

  //   //runs if there is anychange in Tweets collection
  //   const unsubscribe = onSnapshot(tweetquery, async (snapshot) => {
  //     const tweetsData = [];

  //     const fetchUserData = async (tweet, commentArray) => {
  //       const userRef = doc(db, "Users", tweet.author);
  //       const userData = await getDoc(userRef);
  //       if (userData.exists()) {
  //         return {
  //           ...tweet,
  //           user: userData.data(),
  //           commentArray: commentArray,
  //         };
  //       } else {
  //         return { ...tweet, user: null };
  //       }
  //     };

  //     //fetch all the tweets and user data
  //     for (const doc of snapshot.docs) {
  //       let comments = [];
  //       const tweet = { id: doc.id, ...doc.data() };
  //       if (doc.data().commenters.length > 0) {
  //         comments = doc.data().commenters.map((id) => id.userId);
  //       }
  //       const tweetwithuser = await fetchUserData(tweet, comments);
  //       tweetsData.push(tweetwithuser);
  //     }
  //     settweets(tweetsData);
  //     setallpost(tweetsData);
  //   });

  //   return () => unsubscribe();
  // }, []);

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

  useEffect(() => {
    const tweetquery = query(
      collection(db, "Tweets"),
      orderBy("timestamp", "desc"),
    );

    const unsubscribe = onSnapshot(tweetquery, async (snapshot) => {
      const tweetsData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          let comments = [];
          const tweet = { id: doc.id, ...doc.data() };
          if (doc.data().commenters.length > 0) {
            comments = doc.data().commenters.map((id) => id.userId);
          }
          return await fetchUserData(tweet, comments);
        }),
      );
      settweets(tweetsData);
      setallpost(tweetsData);
    });

    return () => unsubscribe();
  }, []);

  useMemo(() => tweets, [tweets]);
  useMemo(() => allpost, [allpost]);

  const handleLike = async (tweetId, author) => {
    await setLikers(tweetId, authuser.uid);
    if (author !== authuser.uid) {
      await StoreNotifications(author, "like", `${user.name} liked your post.`);
    }
  };

  const handlePostDescription = (tweetId) => {
    setSelectedTweetId(tweetId);
    setactive("postdescription");
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
  const handleOtherUserProfile = async (id) => {
    setID(id);
    setprofilecomp("posts");
    setactive("othersprofile");
  };

  const handleForYou = () => {
    setfeed("foryou");
    settweets(allpost);
  };

  const handleFollowingPost = () => {
    setfeed("following");
    const followingPost = [];
    allpost.map((post) => {
      if (user.following.includes(post.author)) {
        followingPost.push(post);
      }
      return followingPost;
    });
    settweets(followingPost);
  };

  const handlePost = (id, tweetId) => {
    if (id === authuser.uid) {
      document.getElementById("more").showModal();

      const deletePost = document.getElementById("delete");

      deletePost.onclick = async function () {
        await HandlePost(id, tweetId);
        toast.success("Deleted");
        document.getElementById("more").close();
      };
    } else {
      return;
    }
  };

  return (
    <>
      <div className="flex h-full w-full flex-col items-center overflow-y-scroll border-l border-r border-gray-800 p-0 sm:p-4">
        <div className="flex w-full flex-row bg-black">
          <button
            className="hover: flex w-1/2 items-center justify-center p-3"
            onClick={handleForYou}
          >
            <p
              className={
                feed === "foryou"
                  ? "border-b-2 border-b-blue-600"
                  : "border-black"
              }
            >
              For You
            </p>
          </button>
          <button
            className="flex w-1/2 items-center justify-center p-3"
            onClick={handleFollowingPost}
          >
            <p
              className={
                feed === "following"
                  ? "border-b-2 border-b-blue-600"
                  : "border-black"
              }
            >
              Following
            </p>
          </button>
        </div>
        <PostSection />

        <div className="w-full">
          {tweets.map((tweet) => (
            <div key={tweet.id}>
              {tweet.user !== null && (
                <div className="flex border-b border-gray-800 bg-gray-900 pt-1 sm:p-4">
                  <img
                    src={
                      tweet.user?.profileImage ||
                      "https://via.placeholder.com/48"
                    }
                    alt="Avatar"
                    className="h-10 w-10 rounded-full sm:h-12 sm:w-12"
                    onClick={() => handleOtherUserProfile(tweet.author)}
                  />
                  <div className="ml-4 flex-1 text-white">
                    <div className="flex items-center">
                      <span
                        className="text-sm font-bold sm:text-xl"
                        onClick={() => handleOtherUserProfile(tweet.author)}
                      >
                        {tweet.user.name}
                      </span>
                      {tweet.user.username && (
                        <span className="ml-2 text-xs text-gray-500 sm:text-lg">
                          @{tweet.user.username}
                        </span>
                      )}
                      <span className="ml-2 text-xs text-gray-500 sm:text-lg">
                        {tweet.formattedTime}
                      </span>
                      <button
                        className="ml-auto text-sm sm:text-lg"
                        onClick={() => handlePost(tweet.author, tweet.id)}
                      >
                        <IoIosMore />
                      </button>
                    </div>
                    <div onClick={() => handlePostDescription(tweet.id)}>
                      <p className="mt-2 text-sm sm:text-lg">{tweet.content}</p>
                      {tweet.file && tweet.type === "image" && (
                        <div>
                          <img
                            src={tweet.file}
                            alt="Tweet"
                            className="mt-2 rounded-lg"
                          />
                        </div>
                      )}
                      {tweet.file && tweet.type === "video" && (
                        <div className="mt-2">
                          <ReactPlayer
                            url={tweet.file}
                            controls
                            width="100%"
                            height="100%"
                            className="w-full shadow-lg"
                            playing={false}
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {tweet.likers.includes(authuser.uid) && (
                        <div className="flex flex-row gap-1">
                          <button
                            className="flex items-center space-x-1"
                            onClick={() => handleUnLike(tweet.id)}
                          >
                            <FaHeart color="red" size={20} />
                          </button>
                          {tweet.likes}
                        </div>
                      )}
                      {!tweet.likers.includes(authuser.uid) && (
                        <div className="flex flex-row gap-1">
                          <button
                            className="flex items-center space-x-1"
                            onClick={() => handleLike(tweet.id, tweet.author)}
                          >
                            <FaRegHeart color="gray" size={20} />
                          </button>
                          {tweet.likes}
                        </div>
                      )}

                      {tweet.commentArray.includes(authuser.uid) && (
                        <div className="flex flex-row gap-1">
                          <button
                            className="flex items-center space-x-1"
                            onClick={handleCommented}
                          >
                            <FaComment color="blue" size={20} />
                          </button>
                          {tweet.comment}
                        </div>
                      )}
                      {!tweet.commentArray.includes(authuser.uid) && (
                        <div className="flex flex-row gap-1">
                          <button
                            className="flex items-center space-x-1"
                            onClick={() => handleComment(tweet.id)}
                          >
                            <FaRegComment color="gray" size={20} />
                          </button>
                          {tweet.comment}
                        </div>
                      )}

                      {user?.retweets.includes(tweet.id) && (
                        <div className="flex flex-row gap-1">
                          <button
                            className="flex items-center space-x-1"
                            onClick={handleRetweeted}
                          >
                            <FaRetweet color="green" size={20} />
                          </button>
                          {tweet?.retweets || 0}
                        </div>
                      )}
                      {!user?.retweets.includes(tweet.id) && (
                        <div className="flex flex-row gap-1">
                          <button
                            className="flex items-center space-x-1"
                            onClick={() =>
                              handleRetweet(tweet.id, tweet.author)
                            }
                          >
                            <FaRetweet color="gray" size={20} />
                          </button>
                          {tweet?.retweets || 0}
                        </div>
                      )}

                      {!user?.retweets && (
                        <div className="flex flex-row gap-1">
                          <button
                            className="flex items-center space-x-1"
                            onClick={() => handleRetweet(tweet.id)}
                          >
                            <FaRetweet color="gray" size={20} />
                          </button>
                          {tweet?.retweets || 0}
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
              )}
            </div>
          ))}
        </div>
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

      {/* modal */}
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
