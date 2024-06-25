import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { StateContext } from "../context/stateContext";

const useGetFollowDetails = () => {
  const { ID } = StateContext();
  const [followersDetails, setfollowersDetails] = useState([]);
  const [followingDetails, setfollowingDetails] = useState([]);
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    const myRef = doc(db, "Users", ID);
    const subscribe = onSnapshot(myRef, async (snapshot) => {
      if (snapshot.exists()) {
        setLoading(true);
        try {
          const myData = await getDoc(myRef);

          const fetchUserData = async (id) => {
            const userRef = doc(db, "Users", id);
            const userData = await getDoc(userRef);
            if (userData.exists()) {
              return { id: id, user: userData.data() };
            } else {
              return { id: id, user: null };
            }
          };

          const FollowersID = myData.data().followers;
          const FollowingID = myData.data().following;

          const FollowersArray = await Promise.all(
            FollowersID.map((id) => fetchUserData(id)),
          );
          const FollowingArray = await Promise.all(
            FollowingID.map((id) => fetchUserData(id)),
          );

          setfollowersDetails(FollowersArray);
          setfollowingDetails(FollowingArray);
          setLoading(false);
        } catch (error) {
          toast.error(error.message);
          setLoading(false);
        }
      }
    });

    return () => subscribe;
  }, [ID]);

  return { Loading, followersDetails, followingDetails };
};

export default useGetFollowDetails;
