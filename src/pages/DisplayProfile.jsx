import { FaArrowLeft } from "react-icons/fa";
import { StateContext } from "../context/stateContext";
import DynamicRender from "../components/Profile/DynamicRender";
import { toast } from "react-hot-toast";
import useGetFollowDetails from "../hooks/useGetFollowDetails";
import Search from "../components/RightSidebar/Search";
import { useState } from "react";
import useFollowing from "../hooks/useFollowing";
import { useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { AuthContext } from "../context/authContext";

export default function OthersProfile() {
  const [data, setdata] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [following, setfollowing] = useState([]);
  const [followers, setfollowers] = useState([]);
  const [open, setopen] = useState(false);

  const { authuser } = AuthContext();
  const {
    setactive,
    loading,
    profilecomp,
    setprofilecomp,
    otheruser,
    setID,
    ID,
    user,
  } = StateContext();
  const { followersDetails, followingDetails, Loading } = useGetFollowDetails();
  const { Follow, UnFollow } = useFollowing();

  useEffect(() => {
    setdata(followingDetails);
    const myRef = doc(db, "Users", authuser.uid);

    const unsubscribe = onSnapshot(myRef, async (snapshot) => {
      if (snapshot.exists()) {
        const followingData = snapshot.data().following;
        const followersData = snapshot.data().followers;
        setfollowing(followingData);
        setfollowers(followersData);
      } else {
        throw new Error("User not autheticated!");
      }
    });

    return () => unsubscribe();
  }, [authuser, followingDetails]);

  const handleFollowers = () => {
    if (otheruser.followers.length === 0) {
      toast.error("No followers");
    } else {
      setdata(followersDetails);
      setopen(true);
      document.getElementById("followModal").showModal();
    }
  };
  const handleFollowing = () => {
    if (otheruser.following.length === 0) {
      toast.error(`Not followed anyone`);
    } else {
      setdata(followingDetails);
      setopen(true);
      document.getElementById("followModal").showModal();
    }
  };

  const handleFollow = async (id) => {
    await Follow(id);
  };

  const handleUnFollow = async (id) => {
    await UnFollow(id);
  };

  const handleMouseEnter = (id, button) => {
    setHoveredId(id);
    setHoveredButton(button);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    setHoveredButton(null);
  };

  const handleOtherUserProfile = async (id) => {
    setID(id);
    setactive("othersprofile");
  };

  return (
    <>
      {!loading && (
        <div className="relative flex h-screen flex-col items-center bg-black text-white">
          <div className="absolute left-0 top-0 z-10 flex w-full items-center border-b border-gray-700 bg-black p-4">
            <button
              className="mr-4 text-white"
              onClick={() => setactive("home")}
            >
              <FaArrowLeft size="1em" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">{otheruser.name}</h1>
              <p className="text-sm text-gray-500">
                {otheruser.createdTweets.length} {"  "}posts
              </p>
            </div>
          </div>
          <div className="w-full overflow-y-scroll">
            <div className="mt-16 h-52 w-full bg-gray-800 sm:h-72">
              {otheruser.coverImage && (
                <img
                  src={otheruser.coverImage}
                  alt="Profile"
                  className="h-full w-full border-4 border-black bg-gray-800 bg-cover"
                />
              )}
            </div>
            <div className="relative mt-[-50px] flex w-full max-w-2xl flex-col">
              <div className="flex flex-row">
                <div>
                  <img
                    src={otheruser.profileImage}
                    alt="Profile"
                    className="h-28 w-28 rounded-full border-4 border-black bg-black"
                  />
                </div>
                <div className="m-1 ml-auto mt-14">
                  {user.followers.includes(ID) &&
                    !user.following.includes(ID) && (
                      <>
                        <button
                          className="ml-auto rounded-full bg-blue-500 px-2 py-2 text-white hover:bg-green-600"
                          onMouseEnter={() =>
                            handleMouseEnter(ID, "followBack")
                          }
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleFollow(ID)}
                        >
                          {hoveredId === ID && hoveredButton === "followBack"
                            ? "Follow Back"
                            : "Follows You"}
                        </button>
                      </>
                    )}
                  {user.following.includes(ID) && (
                    <button
                      className="ml-auto rounded-full bg-blue-500 px-2 py-2 text-white hover:bg-red-600"
                      onMouseEnter={() => handleMouseEnter(ID, "unfollow")}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleUnFollow(ID)}
                    >
                      {hoveredId === ID && hoveredButton === "unfollow"
                        ? "Unfollow"
                        : "Following"}
                    </button>
                  )}
                  {!user.following.includes(ID) &&
                    !user.followers.includes(ID) && (
                      <>
                        <button
                          className="ml-auto rounded-full bg-blue-500 px-2 py-2 text-white hover:bg-blue-600"
                          onClick={() => handleFollow(ID)}
                        >
                          Follow
                        </button>
                      </>
                    )}
                </div>
              </div>
              <div className="mt-4">
                <h1 className="text-2xl font-bold">{otheruser.name}</h1>
                <p className="text-gray-500">@{otheruser.username}</p>
                {otheruser.bio && <p>{otheruser.bio}</p>}
                <p className="text-gray-500">{otheruser.createdDate}</p>
                <div className="mt-2 flex space-x-4">
                  <span className="font-bold">
                    {otheruser.following.length}
                  </span>{" "}
                  <span
                    className="hover:border-b-2 hover:border-b-blue-600"
                    onClick={handleFollowing}
                  >
                    Following
                  </span>
                  <span className="font-bold">
                    {otheruser.followers.length}
                  </span>{" "}
                  <span
                    className="hover:border-b-2 hover:border-b-blue-600"
                    onClick={handleFollowers}
                  >
                    Followers
                  </span>
                </div>
              </div>

              <div className="mt-6 flex w-full justify-center border-b border-gray-700">
                <div className="flex w-full justify-between">
                  <button
                    className={
                      profilecomp === "posts"
                        ? "border-b-2 border-blue-500 py-2 text-blue-500"
                        : "py-2"
                    }
                    onClick={() => setprofilecomp("posts")}
                  >
                    Posts
                  </button>
                  <button
                    className={
                      profilecomp === "replies"
                        ? "border-b-2 border-blue-500 py-2 text-blue-500"
                        : "py-2"
                    }
                    onClick={() => setprofilecomp("replies")}
                  >
                    Replies
                  </button>
                  <button
                    className={
                      profilecomp === "retweet"
                        ? "border-b-2 border-blue-500 py-2 text-blue-500"
                        : "py-2"
                    }
                    onClick={() => setprofilecomp("retweet")}
                  >
                    Retweets
                  </button>
                  <button
                    className={
                      profilecomp === "media"
                        ? "border-b-2 border-blue-500 py-2 text-blue-500"
                        : "py-2"
                    }
                    onClick={() => setprofilecomp("media")}
                  >
                    Media
                  </button>
                  <button
                    className={
                      profilecomp === "likes"
                        ? "border-b-2 border-blue-500 py-2 text-blue-500"
                        : "py-2"
                    }
                    onClick={() => setprofilecomp("likes")}
                  >
                    Likes
                  </button>
                </div>
              </div>
            </div>

            {/* for dynamic profile options render  */}
            <div>
              <DynamicRender />
            </div>
          </div>
        </div>
      )}

      {/* modal to show followers and following */}
      <dialog id="followModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex w-full flex-col items-center justify-center overflow-y-auto">
            <Search />
            {open && !Loading && (
              <div className="mt-2 w-full">
                {data.map((person) => (
                  <div key={person.id}>
                    {person.user !== null && (
                      <div className="mb-4 flex items-center">
                        <img
                          src={person.user.profileImage}
                          alt="Avatar"
                          className="h-12 w-12 rounded-full"
                          onClick={() => handleOtherUserProfile(person.id)}
                        />
                        <div className="ml-2">
                          <span
                            className="block font-bold text-white"
                            onClick={() => handleOtherUserProfile(person.id)}
                          >
                            {person.user.name}
                          </span>
                          <span className="block text-gray-500">
                            @{person.user.username}
                          </span>
                        </div>
                        {person.id === authuser.uid && (
                          <button className="ml-auto rounded-full bg-green-500 px-5 py-2 text-white">
                            You
                          </button>
                        )}
                        {followers.includes(person.id) &&
                          person.id !== authuser.uid &&
                          !following.includes(person.id) && (
                            <>
                              <button
                                className="ml-auto rounded-full bg-blue-500 px-2 py-2 text-white hover:bg-green-600"
                                onMouseEnter={() =>
                                  handleMouseEnter(person.id, "followBack")
                                }
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleFollow(person.id)}
                              >
                                {hoveredId === person.id &&
                                hoveredButton === "followBack"
                                  ? "Follow Back"
                                  : "Follows You"}
                              </button>
                            </>
                          )}
                        {!followers.includes(person.id) &&
                          person.id !== authuser.uid &&
                          following.includes(person.id) && (
                            <button
                              className="ml-auto rounded-full bg-blue-500 px-2 py-2 text-white hover:bg-red-600"
                              onMouseEnter={() =>
                                handleMouseEnter(person.id, "unfollow")
                              }
                              onMouseLeave={handleMouseLeave}
                              onClick={() => handleUnFollow(person.id)}
                            >
                              {hoveredId === person.id &&
                              hoveredButton === "unfollow"
                                ? "Unfollow"
                                : "Following"}
                            </button>
                          )}
                        {followers.includes(person.id) &&
                          person.id !== authuser.uid &&
                          following.includes(person.id) && (
                            <button
                              className="ml-auto rounded-full bg-blue-500 px-2 py-2 text-white hover:bg-red-600"
                              onMouseEnter={() =>
                                handleMouseEnter(person.id, "unfollow")
                              }
                              onMouseLeave={handleMouseLeave}
                              onClick={() => handleUnFollow(person.id)}
                            >
                              {hoveredId === person.id &&
                              hoveredButton === "unfollow"
                                ? "Unfollow"
                                : "Following"}
                            </button>
                          )}
                        {!followers.includes(person.id) &&
                          person.id !== authuser.uid &&
                          !following.includes(person.id) && (
                            <button
                              className="ml-auto rounded-full bg-blue-500 px-2 py-2 text-white hover:bg-blue-600"
                              onClick={() => handleFollow(person.id)}
                            >
                              Follow
                            </button>
                          )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
