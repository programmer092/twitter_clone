import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { AuthContext } from "../../context/authContext";
import PropTypes from "prop-types";
import useFollowing from "../../hooks/useFollowing";
import { StateContext } from "../../context/stateContext";

export default function WhoToFollow({ loading, followers, following }) {
  const [userlist, setuserlist] = useState([]);
  const [showuserlist, setshowuserlist] = useState([]);
  const [string, setstring] = useState("Show more");
  const { authuser } = AuthContext();
  const { Follow, UnFollow } = useFollowing();
  const { setactive, setID, setprofilecomp } = StateContext();

  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "Users"));

    //runs if there is anychange in Users collection
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const userData = [];

      snapshot.forEach((doc) => {
        if (doc.id !== authuser.uid) {
          userData.push({ id: doc.id, ...doc.data() });
        }
      });
      setuserlist(userData);
      setshowuserlist(userData.slice(0, 3));
      setstring("Show more");
    });

    return () => unsubscribe();
  }, [authuser]);

  const handleMore = (e) => {
    e.preventDefault();
    setstring("Show less");
    setshowuserlist(userlist);
  };
  const handleLess = async (e) => {
    e.preventDefault();
    setstring("Show more");
    setshowuserlist(userlist.slice(0, 3));
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
    setprofilecomp("posts");
    setactive("othersprofile");
  };

  return (
    <>
      <div className="w-full rounded-lg bg-gray-900 p-4">
        {!loading && (
          <div>
            <h2 className="mb-4 text-xl font-bold text-white">Who to follow</h2>
            <div className="flex max-h-96 flex-col overflow-y-auto">
              {showuserlist.map((person) => (
                <div key={person.id} className="flex items-center">
                  <div
                    className="mb-4 flex items-center"
                    onClick={() => handleOtherUserProfile(person.id)}
                  >
                    <img
                      src={person.profileImage}
                      alt="Avatar"
                      className="h-12 w-12 rounded-full"
                    />
                    <div className="ml-2">
                      <span className="block font-bold text-white">
                        {person.name}
                      </span>
                      <span className="block text-gray-500">
                        @{person.username}
                      </span>
                    </div>
                  </div>

                  {followers.includes(person.id) &&
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
                  {following.includes(person.id) && (
                    <button
                      className="ml-auto rounded-full bg-blue-500 px-2 py-2 text-white hover:bg-red-600"
                      onMouseEnter={() =>
                        handleMouseEnter(person.id, "unfollow")
                      }
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleUnFollow(person.id)}
                    >
                      {hoveredId === person.id && hoveredButton === "unfollow"
                        ? "Unfollow"
                        : "Following"}
                    </button>
                  )}
                  {!following.includes(person.id) &&
                    !followers.includes(person.id) && (
                      <>
                        <button
                          className="ml-auto rounded-full bg-blue-500 px-2 py-2 text-white hover:bg-blue-600"
                          onClick={() => handleFollow(person.id)}
                        >
                          Follow
                        </button>
                      </>
                    )}
                </div>
              ))}
            </div>
            {string === "Show more" && (
              <button
                className="mt-2 w-full text-blue-500 hover:text-blue-600"
                onClick={handleMore}
              >
                {string}
              </button>
            )}

            {string === "Show less" && (
              <button
                className="mt-2 w-full text-blue-500 hover:text-blue-600"
                onClick={handleLess}
              >
                {string}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

WhoToFollow.propTypes = {
  loading: PropTypes.bool.isRequired,
  followers: PropTypes.array.isRequired,
  following: PropTypes.array.isRequired,
};
