import { doc, setDoc } from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { db } from "../firebase/firebase";
import { AuthContext } from "../context/authContext";
import { storage } from "../firebase/firebase";
import toast from "react-hot-toast";
import {
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";
import { useState } from "react";

const useUpdateProfile = () => {
  const [isError, setisError] = useState(false);
  const { authuser } = AuthContext();
  const Update = async (user) => {
    const Ref = doc(db, "Users", authuser.uid);
    setisError(false);
    try {
      if (authuser.providerData[0].providerId === "password") {
        if (user.bio.trim() !== "") {
          await setDoc(Ref, { bio: user.bio }, { merge: true });
        }

        if (user.profileImg) {
          const storageRef = ref(storage, `profileImages/${authuser.uid}`);
          await uploadBytes(storageRef, user.profileImg);
          const profileImageUrl = await getDownloadURL(storageRef);

          await setDoc(Ref, { profileImage: profileImageUrl }, { merge: true });
        }
        if (user.coverImg) {
          const storageRef = ref(storage, `coverImages/${authuser.uid}`);
          await uploadBytes(storageRef, user.coverImg);
          const coverImageUrl = await getDownloadURL(storageRef);

          await setDoc(Ref, { coverImage: coverImageUrl }, { merge: true });
        }
        if (user.newpassword.trim !== "" && user.currentpassword !== "") {
          const credential = EmailAuthProvider.credential(
            authuser.email,
            user.currentpassword,
          );
          try {
            await reauthenticateWithCredential(authuser, credential);
            await updatePassword(authuser, user.newpassword);
          } catch (error) {
            setisError(true);
            toast.error(error.message);
          }
        }
      } else {
        if (user.bio.trim() !== "") {
          await setDoc(Ref, { bio: user.bio }, { merge: true });
        }
        if (user.profileImg) {
          const storageRef = ref(storage, `profileImages/${authuser.uid}`);
          await uploadBytes(storageRef, user.profileImg);
          const profileImageUrl = await getDownloadURL(storageRef);

          await setDoc(Ref, { profileImage: profileImageUrl }, { merge: true });
        }
        if (user.coverImg) {
          const storageRef = ref(storage, `coverImages/${authuser.uid}`);
          await uploadBytes(storageRef, user.coverImg);
          const coverImageUrl = await getDownloadURL(storageRef);

          await setDoc(Ref, { coverImage: coverImageUrl }, { merge: true });
        }
      }
    } catch (error) {
      setisError(true);
      toast.error(error.message);
    }
  };

  return { Update, isError };
};

export default useUpdateProfile;
