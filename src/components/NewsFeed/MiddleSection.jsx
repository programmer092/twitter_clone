import { StateContext } from "../../context/stateContext";
import OthersProfile from "../../pages/DisplayProfile";
import Profile from "../../pages/Profile";
import Feed from "./Feed";
import PostDescription from "./PostDescription";
import SearchMiddle from "./SearchMiddle";
import Notifications from "./Notification";
import { useEffect } from "react";

export default function MiddleSection() {
  const { active, setactive } = StateContext();

  // Reset the active state when the component unmounts so that homw page is displayed when the user logs in again
  useEffect(() => {
    return () => {
      setactive("home");
    };
  }, [setactive]);

  const component = () => {
    switch (active) {
      case "home":
        return <Feed />;
      case "profile":
        return <Profile />;

      case "search":
        return <SearchMiddle />;

      case "postdescription":
        return <PostDescription />;

      case "othersprofile":
        return <OthersProfile />;

      case "notifications":
        return <Notifications />;

      default:
        return <Feed />;
    }
  };
  return <>{component()}</>;
}
