import { useState } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/authContext";
import { storage, db } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const [file, setfile] = useState(null);
  const { authuser } = AuthContext();
  const [username, setusername] = useState("");
  const nav = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (authuser.providerData[0].providerId === "password") {
      if (!username || username.length < 4) {
        toast.error(
          "Username is required and should be atleast 4 characters long",
        );
        return;
      } else if (!file) {
        toast.error("Select a image first");
        return;
      } else {
        const storageRef = ref(storage, `profileImages/${authuser.uid}`);
        await uploadBytes(storageRef, file);
        const profileImageUrl = await getDownloadURL(storageRef);

        await updateDoc(doc(db, "Users", authuser.uid), {
          username: username,
          profileImage: profileImageUrl,
        });

        nav("/home");
      }
    }
    if (authuser.providerData[0].providerId !== "password") {
      if (!username || username.length < 4) {
        toast.error(
          "Username is required and should be atleast 4 characters long",
        );
        return;
      } else {
        const storageRef = ref(storage, `profileImages/${authuser.uid}`);
        await uploadBytes(storageRef, authuser.photoURL);
        const profileImageUrl = await getDownloadURL(storageRef);

        await updateDoc(doc(db, "Users", authuser.uid), {
          profileImage: profileImageUrl,
          username: username,
        });

        nav("/home");
      }
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <label className="block text-sm font-medium leading-6 text-blue-600">
              Username
            </label>
            <div className="mt-2">
              <input
                value={username}
                type="text"
                onChange={(e) => setusername(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <form action="submit">
              {authuser.providerData[0].providerId === "password" && (
                <>
                  <label className="mt-4 block text-sm font-medium leading-6 text-blue-600">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered file-input-accent mb-2 w-full"
                    onChange={(e) => setfile(e.target.files[0])}
                  />
                </>
              )}
              <button
                onClick={handleUpdate}
                type="submit"
                className="mt-4 w-full rounded-md bg-green-900 p-2 text-center"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
