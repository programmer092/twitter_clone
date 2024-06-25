import Search from "./Search";
import WhoToFollow from "./Follow";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../../context/authContext";
import { db } from "../../firebase/firebase";

export default function RightSidebar() {
  const [loading, setloading] = useState(true);
  const [followers, setfollowers] = useState([]);
  const [following, setfollowing] = useState([]);
  const { authuser } = AuthContext();

  useEffect(() => {
    const myRef = doc(db, "Users", authuser.uid);

    setloading(true);
    const unsubscribe = onSnapshot(myRef, async (snapshot) => {
      if (snapshot.exists()) {
        const followingData = snapshot.data().following;
        const followersData = snapshot.data().followers;
        setfollowing(followingData);
        setfollowers(followersData);
        setloading(false);
      } else {
        throw new Error("User not autheticated!");
      }
    });

    return () => unsubscribe();
  }, [authuser]);

  return (
    <div className="w-full space-y-4 p-4">
      {/* Search Input */}
      <Search />

      {/* Who to Follow */}
      <WhoToFollow
        loading={loading}
        followers={followers}
        following={following}
      />
    </div>
  );
}
