import { FaRegComment, FaComment, FaRegHeart, FaHeart } from "react-icons/fa";
import { FaArrowRightArrowLeft, FaRetweet } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import useLikers from "../../hooks/useLikers";
import useRetweet from "../../hooks/useRetweet";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-hot-toast";
import { StateContext } from "../../context/stateContext";
import CommentModal from "./CommentModal";
import ReactPlayer from "react-player/lazy";
import useHandleLike from "../../hooks/useHandleLike";
import useStoreNotifications from "../../hooks/useStoreNotifications";
import PropTypes from "prop-types";
import useHandlePost from "../../hooks/useHandlePost";

export default function PostModal({ array, type }) {
  const { setLikers } = useLikers();
  const { Retweet } = useRetweet();
  const { authuser } = AuthContext();
  const { setactive, setSelectedTweetId, user, setID, otheruser } =
    StateContext();
  const { UnLike } = useHandleLike();
  const { StoreNotifications } = useStoreNotifications();
  const { HandlePost } = useHandlePost();

  const handleLike = async (tweetId, author) => {
    await setLikers(tweetId, authuser.uid);
    await StoreNotifications(author, "like", `${user.name} liked your post.`);
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
    await StoreNotifications(
      author,
      "retweet",
      `${user.name} retweeted your post.`,
    );
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
    setactive("othersprofile");
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
      <div>
        <div className="w-full pb-12 sm:pb-0">
          {array.map((tweet) => (
            <div key={tweet.id}>
              {!tweet.message && tweet.user !== null && (
                <>
                  {type === "retweet" && (
                    <div className="flex items-center space-x-3 bg-gray-900 text-sm text-gray-500">
                      <FaRetweet size={18} />
                      <span>Reposts</span>
                    </div>
                  )}

                  <div className="flex border-b border-gray-800 bg-gray-900 p-1 sm:p-4">
                    <img
                      src={
                        tweet.user.profileImage ||
                        "https://via.placeholder.com/48"
                      }
                      alt="Avatar"
                      className="h-9 w-9 rounded-full sm:h-12 sm:w-12"
                      onClick={() => handleOtherUserProfile(tweet.author)}
                    />
                    <div className="ml-2 flex-1 text-white sm:ml-4">
                      <div className="flex items-center">
                        <span
                          className="text-sm font-bold sm:text-xl"
                          onClick={() => handleOtherUserProfile(tweet.author)}
                        >
                          {tweet.user.name}
                        </span>
                        {tweet.user.username && (
                          <span className="ml-1 text-xs text-gray-500 sm:ml-2 sm:text-lg">
                            @{tweet.user.username}
                          </span>
                        )}
                        <span className="ml-1 text-xs text-gray-500 sm:ml-2 sm:text-lg">
                          {tweet.formattedTime}
                        </span>
                        <button
                          className="ml-auto text-xs sm:text-lg"
                          onClick={() => handlePost(tweet.author, tweet.id)}
                        >
                          <IoIosMore />
                        </button>
                      </div>

                      <div onClick={() => handlePostDescription(tweet.id)}>
                        <p className="mt-1 text-sm sm:mt-2 sm:text-lg">
                          {tweet.content}
                        </p>
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
                  {type === "replies" && (
                    <div className="mb-1 mt-2 flex flex-col border-b border-gray-700 p-1">
                      <div className="mt-2 flex flex-row space-x-3 sm:mt-4">
                        <img
                          src={otheruser.profileImage}
                          className="h-7 w-7 rounded-full sm:h-9 sm:w-9"
                        />
                        <div className="flex items-center">
                          <span className="text-xs font-bold sm:text-lg">
                            {otheruser.name}
                          </span>
                          <span className="ml-1 text-xs text-gray-500 sm:ml-2 sm:text-lg">
                            @{otheruser.username}
                          </span>
                          <span className="ml-1 text-xs text-gray-500 sm:ml-2 sm:text-lg">
                            {tweet.mycomment.time}
                          </span>
                        </div>
                      </div>
                      <div className="space-x-5 p-2">
                        <p className="text-sm">{tweet.mycomment.comment}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* modal */}
      <dialog id="commentModal" className="modal modal-middle">
        <div className="modal-box w-full bg-gray-900 md:w-2/4">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
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

PostModal.propTypes = {
  array: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};
