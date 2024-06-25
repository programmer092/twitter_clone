import { Avatar } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Auth } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function UserCard() {
  const [user, setuser] = useState(null);
  const { authuser } = AuthContext();
  const nav = useNavigate();
  const { SignOut } = Auth();

  const handleLogout = async () => {
    await SignOut();
    nav("/");
  };

  useEffect(() => {
    const getData = async () => {
      const Data = await getDoc(doc(db, "Users", authuser.uid));
      const userDoc = Data.data();
      setuser(userDoc);
    };

    getData();
  }, [authuser]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="dropdown dropdown-top flex">
        <div
          tabIndex={0}
          role="button"
          className="btn flex h-14 w-full flex-row items-center justify-center bg-black"
        >
          <Avatar
            alt="Bikash Bohara"
            src={user.profileImage}
            sx={{ width: 50, height: 50 }}
          />
          <div className="hidden text-sm custom:block">
            <p>{user.name}</p>
            <p>@{user.username}</p>
          </div>
          <div className="ml-auto hidden p-1 custom:block">
            <MoreHorizIcon />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] flex w-full items-center justify-center rounded-box bg-base-100 p-2 shadow"
        >
          <li onClick={handleLogout} className="cursor-pointer">
            Logout
          </li>
        </ul>
      </div>
    </>
  );
}
