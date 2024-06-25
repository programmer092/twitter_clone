import { useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const useGetNotifications = () => {
  const { authuser } = AuthContext();
  const [notification, setnotification] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Notifications", authuser.uid),
      async (snapshot) => {
        if (snapshot.empty) return;
        const getNotification = async () => {
          const notiRef = doc(db, "Notifications", authuser.uid);
          const noti = await getDoc(notiRef);

          const fetchUser = async (data) => {
            const userRef = doc(db, "Users", data.userId);
            const userData = await getDoc(userRef);
            if (userData.exists()) {
              return {
                id: data.userId,
                user: userData.data(),
                message: data.message,
                time: data.time,
                formattedTime: data.formattedtime,
              };
            } else {
              return [];
            }
          };

          if (noti.exists()) {
            const Data = noti.data().notifications;
            if (Data.length > 0) {
              const Info = await Promise.all(
                Data.map((data) => fetchUser(data)),
              );
              const sortedInfo = Info.sort((a, b) => b.time - a.time);
              setnotification(sortedInfo);
            } else {
              setnotification([]);
            }
          }
        };
        getNotification();
      },
    );

    return () => unsubscribe();
  }, [authuser]);

  return { notification };
};
export default useGetNotifications;
