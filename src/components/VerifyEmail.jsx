import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function VerifyEmail({ children }) {
  const [isverified, setisverified] = useState(auth.currentUser?.emailVerified);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setisverified(user.emailVerified);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isverified === false) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="h-12 w-full">
          <h1 className="flex items-center justify-center text-blue-800">
            Verify Email to proceed further !!!
          </h1>
          <h3 className="flex items-center justify-center text-red-800">
            Refresh If you have already verified your email.
          </h3>
        </div>
      </div>
    );
  }

  return children;
}
