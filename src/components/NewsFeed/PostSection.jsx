import { useRef, useState } from "react";
import useStoretweet from "../../hooks/useStoretweet";
import { toast } from "react-hot-toast";

import {
  FaImage,
  FaChartBar,
  FaSmile,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { StateContext } from "../../context/stateContext";
import EmojiPicker from "emoji-picker-react";

export default function PostSection() {
  const [content, setcontent] = useState("");
  const [isopen, setisopen] = useState(false);

  const { storetweet } = useStoretweet();
  const [file, setfile] = useState("");
  const { user } = StateContext();

  const InputRef = useRef(null);

  const handleIcon = () => {
    InputRef.current.click();
  };
  const handleClick = async (e) => {
    e.preventDefault();
    if (!file && (!content || content.trim() === "")) {
      return toast.error("Post cannot be empty!");
    }
    await storetweet(content, file);

    //clear post section
    setcontent("");
    setfile("");
    document.getElementById("postmodal").close();
  };

  return (
    <>
      <div className="flex w-full min-w-64 rounded-md border-b border-gray-800 bg-gray-900 pt-1 sm:p-4">
        <img
          src={user.profileImage}
          alt="Avatar"
          className="h-10 w-10 rounded-full sm:h-12 sm:w-12"
        />
        <div className="ml-1 mr-2 flex-1 sm:ml-4">
          <textarea
            value={content}
            onChange={(e) => setcontent(e.target.value)}
            placeholder="What is happening?!"
            className="h-18 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white focus:outline-none md:h-20"
          />

          <span>{file.name}</span>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex space-x-2 text-blue-400">
              <div onClick={handleIcon} className="cursor-pointer">
                <FaImage />
                <input
                  type="file"
                  className="hidden"
                  ref={InputRef}
                  onChange={(e) => setfile(e.target.files[0])}
                />
              </div>
              <FaChartBar />
              <FaSmile
                onClick={() => {
                  if (isopen) {
                    setisopen(false);
                  } else {
                    setisopen(true);
                  }
                }}
              />
              <FaCalendarAlt />
              <FaMapMarkerAlt />
            </div>
            <button
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 sm:px-4 sm:py-2"
              onClick={handleClick}
            >
              Post
            </button>
          </div>

          <EmojiPicker
            open={isopen}
            height={325}
            width={screen}
            onEmojiClick={(emoji) => {
              setcontent(content + emoji.emoji);
            }}
          />
        </div>
      </div>
    </>
  );
}
