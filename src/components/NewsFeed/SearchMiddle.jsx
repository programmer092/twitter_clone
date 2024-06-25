import Search from "../RightSidebar/Search";
import { StateContext } from "../../context/stateContext";
import { FaArrowLeft } from "react-icons/fa";

export default function SearchMiddle() {
  const { setactive } = StateContext();
  return (
    <>
      <div className="flex h-full w-full flex-col items-center overflow-y-scroll border-l border-r border-gray-800 p-4">
        <div className="flex w-full">
          <button
            className="mr-4 rounded-md text-white"
            onClick={() => setactive("home")}
          >
            <FaArrowLeft size="1em" />
          </button>
          <div className="flex-grow">
            <Search />
          </div>
        </div>
      </div>
    </>
  );
}
