import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/firebase";
import useTime from "../utils/useTime";
const useStoreNotifications = () => {
  const { time } = useTime();
  const { authuser } = AuthContext();
  const StoreNotifications = async (id, type, msg) => {
    if (id === authuser.uid) return;
    const Ref = doc(db, "Notifications", id);

    const Data = await getDoc(Ref);
    const notificationData = {
      userId: authuser.uid,
      type: type,
      message: msg,
      time: Date.now(),
      formattedtime: time(Date.now()),
    };
    if (Data.exists()) {
      await updateDoc(Ref, {
        notifications: arrayUnion(notificationData),
      });
    } else {
      await setDoc(
        Ref,
        {
          notifications: [notificationData],
        },
        {
          merge: true,
        },
      );
    }
  };

  return { StoreNotifications };
};

export default useStoreNotifications;
