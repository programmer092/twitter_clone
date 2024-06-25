import { FaArrowLeft } from "react-icons/fa";
import { StateContext } from "../context/stateContext";
import DynamicRender from "../components/Profile/DynamicRender";
import { toast } from "react-hot-toast";
import useGetFollowDetails from "../hooks/useGetFollowDetails";
import Search from "../components/RightSidebar/Search";
import { useState } from "react";
import useFollowing from "../hooks/useFollowing";
import { useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import useUpdateProfile from "../hooks/useUpdateProfile";
import { TbLogout2 } from "react-icons/tb";
import { Auth } from "../firebase/auth";

export default function Profile() {
  const [data, setdata] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [following, setfollowing] = useState([]);
  const [open, setopen] = useState(false);
  const [newpassword, setnewpassword] = useState("");
  const [coverImg, setcoverImg] = useState(null);
  const [profileImg, setprofileImg] = useState(null);
  const [currentpassword, setcurrentpassword] = useState("");
  const [bio, setbio] = useState("");
  const { authuser } = AuthContext();
  const { Update, isError } = useUpdateProfile();
  const { SignOut } = Auth();

  const { setactive, user, loading, profilecomp, setprofilecomp, setID } =
    StateContext();
  const { followersDetails, followingDetails, Loading } = useGetFollowDetails();
  const { Follow, UnFollow } = useFollowing();

  useEffect(() => {
    setdata(followingDetails);
    const myRef = doc(db, "Users", authuser.uid);

    const unsubscribe = onSnapshot(myRef, async (snapshot) => {
      if (snapshot.exists()) {
        const followingData = snapshot.data().following;
        setfollowing(followingData);
      } else {
        throw new Error("User not autheticated!");
      }
    });

    return () => unsubscribe();
  }, [authuser, followingDetails]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (
      authuser.providerData[0].providerId !== "password" &&
      !coverImg &&
      !profileImg &&
      bio.trim() === ""
    ) {
      return document.getElementById("editProfile").close();
    }

    if (
      authuser.providerData[0].providerId === "password" &&
      !coverImg &&
      !profileImg &&
      bio.trim() === "" &&
      newpassword.trim() === "" &&
      currentpassword.trim() === ""
    ) {
      return document.getElementById("editProfile").close();
    }

    if (authuser.providerData[0].providerId !== "password") {
      const updateData = {
        bio,
        coverImg,
        profileImg,
      };
      document.getElementById("editProfile").close();
      toast("Updating", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 500,
      });
      await Update(updateData);
      setbio("");
      setprofileImg(null);
      setcoverImg(null);
      setcurrentpassword("");
      setnewpassword("");
      {
        !isError && toast.success("Updated");
      }
    }

    if (authuser.providerData[0].providerId === "password") {
      const updateData = {
        bio,
        coverImg,
        profileImg,
        newpassword,
        currentpassword,
      };
      document.getElementById("editProfile").close();
      toast("Updating", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 500,
      });
      await Update(updateData);
      setbio("");
      setprofileImg(null);
      setcoverImg(null);
      setcurrentpassword("");
      setnewpassword("");
      {
        !isError && toast.success("Updated");
      }
    }
  };

  const handleFollowers = () => {
    if (user.followers.length === 0) {
      toast.error("No followers");
    } else {
      setdata(followersDetails);
      setopen(true);
      document.getElementById("followModal").showModal();
    }
  };
  const handleFollowing = () => {
    if (user.following.length === 0) {
      toast.error(`You haven't followed anyone`);
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

  const handleLikeSection = () => {
    setID(authuser.uid);
    setprofilecomp("likes");
  };
  const handleRetweetSection = () => {
    setID(authuser.uid);
    setprofilecomp("retweet");
  };
  const handleRepliesSection = () => {
    setID(authuser.uid);
    setprofilecomp("replies");
  };
  const handleMediaSection = () => {
    setID(authuser.uid);
    setprofilecomp("media");
  };
  const handlePostSection = () => {
    setID(authuser.uid);
    setprofilecomp("posts");
  };

  const handleOtherUserProfile = async (id) => {
    setID(id);
    setactive("othersprofile");
  };

  const handleEdit = () => {
    document.getElementById("editProfile").showModal();
  };

  const handleLogout = async () => {
    await SignOut();
    window.localStorage.clear();
    window.sessionStorage.clear();
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
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-gray-500">
                {user.createdTweets.length} {"  "}posts
              </p>
            </div>
            <div className="ml-auto flex sm:hidden">
              <button onClick={handleLogout}>
                <TbLogout2 size={18} />
              </button>
            </div>
          </div>
          <div className="w-full overflow-y-scroll">
            <div className="mt-16 h-52 w-full bg-gray-800 sm:h-72">
              {user.coverImage && (
                <img
                  src={user.coverImage}
                  alt="Profile"
                  className="h-full w-full border-4 border-black bg-gray-800 bg-cover"
                />
              )}
            </div>
            <div className="relative mt-[-50px] flex w-full max-w-2xl flex-col">
              <div className="flex flex-row">
                <div>
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="h-28 w-28 rounded-full border-4 border-black bg-black"
                  />
                </div>
                <div className="m-1 ml-auto mt-14">
                  <button
                    className="rounded-full bg-blue-500 px-4 py-2 text-white"
                    onClick={handleEdit}
                  >
                    Edit profile
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-500">@{user.username}</p>
                {user.bio && <p>{user.bio}</p>}
                <p className="text-gray-500">{user.createdDate}</p>
                <div className="mt-2 flex space-x-4">
                  <span className="font-bold">{user.following.length}</span>{" "}
                  <span
                    className="hover:border-b-2 hover:border-b-blue-600"
                    onClick={handleFollowing}
                  >
                    Following
                  </span>
                  <span className="font-bold">{user.followers.length}</span>{" "}
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
                    onClick={handlePostSection}
                  >
                    Posts
                  </button>
                  <button
                    className={
                      profilecomp === "replies"
                        ? "border-b-2 border-blue-500 py-2 text-blue-500"
                        : "py-2"
                    }
                    onClick={handleRepliesSection}
                  >
                    Replies
                  </button>
                  <button
                    className={
                      profilecomp === "retweet"
                        ? "border-b-2 border-blue-500 py-2 text-blue-500"
                        : "py-2"
                    }
                    onClick={handleRetweetSection}
                  >
                    Retweets
                  </button>
                  <button
                    className={
                      profilecomp === "media"
                        ? "border-b-2 border-blue-500 py-2 text-blue-500"
                        : "py-2"
                    }
                    onClick={handleMediaSection}
                  >
                    Media
                  </button>
                  <button
                    className={
                      profilecomp === "likes"
                        ? "border-b-2 border-blue-500 py-2 text-blue-500"
                        : "py-2"
                    }
                    onClick={handleLikeSection}
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

                        {!following.includes(person.id) && (
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
                        {following.includes(person.id) && (
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
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </dialog>

      {/* modal for editting profile */}
      <dialog id="editProfile" className="modal h-auto">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="h-full w-full flex-col">
            <div>
              <p className="font-bold">Add Bio:</p>
              <textarea
                name="Bio"
                id="bio"
                className="w-full"
                value={bio}
                onChange={(e) => setbio(e.target.value)}
              />
            </div>
            <div className="mt-1">
              <p className="font-bold">Add cover photo:</p>
              <input
                type="file"
                onChange={(e) => setcoverImg(e.target.files[0])}
              />
            </div>
            <div className="mt-1">
              <p className="font-bold">Update profile photo:</p>
              <input
                type="file"
                onChange={(e) => setprofileImg(e.target.files[0])}
              />
            </div>
            {authuser.providerData[0].providerId === "password" && (
              <div className="mt-1">
                <p className="font-bold">Change Password:</p>
                <input
                  type="text"
                  placeholder="current password"
                  className="mb-1 rounded-sm p-2 sm:mb-0"
                  value={currentpassword}
                  onChange={(e) => setcurrentpassword(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="new password"
                  className="ml-0 rounded-sm p-2 sm:ml-2"
                  value={newpassword}
                  onChange={(e) => setnewpassword(e.target.value)}
                />
              </div>
            )}
          </div>
          <div>
            <button
              className="mt-4 flex w-full items-center justify-center rounded-md border-2 border-green-900 bg-blue-600 p-1 font-bold"
              onClick={handleUpdateProfile}
            >
              Update
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
