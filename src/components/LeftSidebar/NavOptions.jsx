import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EmailIcon from "@mui/icons-material/Email";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import Person2Icon from "@mui/icons-material/Person2";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import CreateIcon from "@mui/icons-material/Create";
import { useState } from "react";
import UserCard from "./UserCard";
import PostSection from "../NewsFeed/PostSection";
import { StateContext } from "../../context/stateContext";
import { AuthContext } from "../../context/authContext";

export default function NavOptions() {
  const [email, setemail] = useState(false);
  const [post, setpost] = useState(false);
  const { active, setactive, setID, setprofilecomp } = StateContext();
  const { authuser } = AuthContext();

  const handleProfile = () => {
    setID(authuser.uid);
    setprofilecomp("posts");
    setactive("profile");
  };

  return (
    <>
      {/* Navoptions wih name for larger screen */}
      <div className="hidden h-screen w-full flex-col bg-black custom:flex">
        <div className="flex h-16 items-center justify-center border-b">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="mr-4 h-8 w-8"
            fill="currentColor"
          >
            <g>
              <path d="M23.954 4.569c-.885.385-1.83.647-2.825.765 1.014-.608 1.794-1.569 2.163-2.724-.95.567-2.005.978-3.127 1.197-.897-.959-2.178-1.558-3.594-1.558-2.723 0-4.928 2.205-4.928 4.925 0 .386.045.762.127 1.124-4.094-.205-7.725-2.168-10.148-5.144-.425.722-.666 1.561-.666 2.475 0 1.708.87 3.213 2.188 4.096-.806-.026-1.564-.247-2.228-.616v.062c0 2.385 1.697 4.374 3.946 4.829-.413.111-.848.171-1.296.171-.316 0-.623-.03-.923-.086.631 1.953 2.445 3.376 4.604 3.415-1.684 1.32-3.808 2.105-6.102 2.105-.397 0-.788-.023-1.175-.067 2.179 1.397 4.768 2.209 7.548 2.209 9.054 0 14.002-7.496 14.002-13.986 0-.21-.005-.42-.014-.63.962-.695 1.8-1.562 2.462-2.549z"></path>
            </g>
          </svg>
        </div>
        <nav className="flex-1 space-y-2 px-2 py-4">
          <div
            className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
            onClick={() => setactive("home")}
          >
            {active === "home" ? <HomeIcon /> : <HomeOutlinedIcon />}
            Home
          </div>
          <div
            className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
            onClick={() => setactive("search")}
          >
            <SearchOutlinedIcon /> Search
          </div>
          <div
            className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
            onClick={() => setactive("notifications")}
          >
            {active === "notifications" ? (
              <NotificationsIcon />
            ) : (
              <NotificationsNoneOutlinedIcon />
            )}
            Notifications
          </div>
          <div
            className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
            onClick={() => setemail(true)}
          >
            {email ? <EmailIcon /> : <EmailOutlinedIcon />}Messages
          </div>
          <div
            className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
            onClick={handleProfile}
          >
            {active === "profile" ? <Person2Icon /> : <Person2OutlinedIcon />}
            Profile
          </div>
          <div className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300">
            <MoreHorizOutlinedIcon /> More
          </div>
          <div
            className="flex items-center justify-center rounded-md bg-blue-500 p-2"
            onClick={() => document.getElementById("postmodal").showModal()}
          >
            <button>POST</button>
          </div>
        </nav>
        <UserCard />
      </div>

      {/* Navoptions with only icons in smaller screen */}
      <div className="flex h-screen w-full flex-col bg-black custom:hidden">
        <div className="flex h-16 items-center justify-center border-b">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="mr-4 h-8 w-8"
            fill="currentColor"
          >
            <g>
              <path d="M23.954 4.569c-.885.385-1.83.647-2.825.765 1.014-.608 1.794-1.569 2.163-2.724-.95.567-2.005.978-3.127 1.197-.897-.959-2.178-1.558-3.594-1.558-2.723 0-4.928 2.205-4.928 4.925 0 .386.045.762.127 1.124-4.094-.205-7.725-2.168-10.148-5.144-.425.722-.666 1.561-.666 2.475 0 1.708.87 3.213 2.188 4.096-.806-.026-1.564-.247-2.228-.616v.062c0 2.385 1.697 4.374 3.946 4.829-.413.111-.848.171-1.296.171-.316 0-.623-.03-.923-.086.631 1.953 2.445 3.376 4.604 3.415-1.684 1.32-3.808 2.105-6.102 2.105-.397 0-.788-.023-1.175-.067 2.179 1.397 4.768 2.209 7.548 2.209 9.054 0 14.002-7.496 14.002-13.986 0-.21-.005-.42-.014-.63.962-.695 1.8-1.562 2.462-2.549z"></path>
            </g>
          </svg>
        </div>
        <nav className="flex-1 space-y-2 px-2 py-4">
          <div
            className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
            onClick={() => setactive("home")}
          >
            {active === "home" ? <HomeIcon /> : <HomeOutlinedIcon />}
          </div>
          <div
            className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
            onClick={() => setactive("search")}
          >
            <SearchOutlinedIcon />
          </div>
          <div
            className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
            onClick={() => setactive("notifications")}
          >
            {active === "notifications" ? (
              <NotificationsIcon />
            ) : (
              <NotificationsNoneOutlinedIcon />
            )}
          </div>
          <div
            className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
            onClick={() => setemail(true)}
          >
            {email ? <EmailIcon /> : <EmailOutlinedIcon />}
          </div>
          <div
            className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300"
            onClick={() => setactive("profile")}
          >
            {active === "profile" ? <Person2Icon /> : <Person2OutlinedIcon />}
          </div>
          <div className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-base font-medium leading-5 text-white hover:bg-slate-300">
            <MoreHorizOutlinedIcon />
          </div>
          <div
            className="flex items-center justify-center rounded-md bg-blue-500 p-2"
            onClick={() => {
              setpost(true);
              document.getElementById("postmodal").showModal();
            }}
          >
            {post ? <CreateIcon /> : <CreateOutlinedIcon />}
          </div>
        </nav>
        <div className="hidden sm:block">
          <UserCard />
        </div>
      </div>

      {/* modal */}
      <dialog id="postmodal" className="modal modal-top sm:modal-middle">
        <div className="modal-box w-full md:w-2/4">
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
