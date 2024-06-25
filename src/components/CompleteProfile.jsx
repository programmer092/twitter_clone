import { useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// eslint-disable-next-line react/prop-types
export default function CompleteProfile({ children }) {
  const nav = useNavigate();
  const { authuser, isLoading } = AuthContext();
  const [isprofilecomplete, setisprofilecomplete] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!authuser) {
      nav("/");
    }

    const isComplete = async () => {
      const userData = await getDoc(doc(db, "Users", authuser.uid));

      if (
        userData.exists() &&
        userData.data().username &&
        userData.data().profileImage
      ) {
        setisprofilecomplete(true);
      } else {
        nav("/updateProfile");
      }
    };

    isComplete();
  }, [isLoading, authuser, nav]);

  if (!isprofilecomplete) {
    return <div>loading....</div>;
  }

  return children;
}
