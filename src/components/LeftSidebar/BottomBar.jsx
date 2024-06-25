import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import Person2Icon from "@mui/icons-material/Person2";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import CreateIcon from "@mui/icons-material/Create";
import { useState } from "react";
import PostSection from "../NewsFeed/PostSection";
import { StateContext } from "../../context/stateContext";
import { AuthContext } from "../../context/authContext";

export default function BottomBar() {
  const [post, setpost] = useState(false);
  const { active, setactive, setprofilecomp, setID } = StateContext();
  const { authuser } = AuthContext();

  const handleProfile = () => {
    setID(authuser.uid);
    setprofilecomp("posts");
    setactive("profile");
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between bg-black p-1">
        <div
          className="flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
          onClick={() => setactive("home")}
        >
          {active === "home" ? <HomeIcon /> : <HomeOutlinedIcon />}
        </div>
        <div
          className="flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
          onClick={() => setactive("search")}
        >
          <SearchOutlinedIcon />
        </div>
        <div
          className="flex items-center justify-center rounded-md bg-blue-500 p-2"
          onClick={() => {
            setpost(true);
            document.getElementById("newmodal").showModal();
          }}
        >
          {post ? <CreateIcon /> : <CreateOutlinedIcon />}
        </div>
        <div
          className="flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
          onClick={() => setactive("notifications")}
        >
          {active === "notifications" ? (
            <NotificationsIcon />
          ) : (
            <NotificationsNoneOutlinedIcon />
          )}
        </div>
        <div
          className="flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
          onClick={handleProfile}
        >
          {active === "profile" ? <Person2Icon /> : <Person2OutlinedIcon />}
        </div>
      </div>

      <dialog id="newmodal" className="modal modal-top sm:modal-middle">
        <div className="modal-box w-full bg-gray-900 md:w-2/4">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>
          <PostSection />
        </div>
      </dialog>
    </>
  );
}
