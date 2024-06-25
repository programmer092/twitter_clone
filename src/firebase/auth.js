import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase";

const Auth = () => {
  const CreateLoginUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const LoginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const LoginwithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const user = await signInWithPopup(auth, provider);
    return user;
  };

  const LoginwithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    const user = await signInWithPopup(auth, provider);
    return user;
  };

  const SignOut = async () => {
    return await auth.signOut();
  };

  return {
    CreateLoginUser,
    LoginUser,
    LoginwithGoogle,
    SignOut,
    LoginwithFacebook,
  };
};

export { Auth };
