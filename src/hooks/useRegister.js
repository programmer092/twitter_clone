import { Auth } from "../firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import useTime from "../utils/useTime";
import { sendEmailVerification } from "firebase/auth";

const useRegister = () => {
  const { CreateLoginUser } = Auth();
  const { time } = useTime();
  const register = async (name, email, password) => {
    try {
      await CreateLoginUser(email, password);
      await sendEmailVerification(auth.currentUser).then(() =>
        toast.success("Verification email sent!"),
      );

      const user = auth.currentUser;

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          name: name,
          email: user.email,
          followers: [],
          following: [],
          createdTweets: [],
          createdDate: time(Date.now()),
          retweets: [],
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return { register };
};

export default useRegister;
