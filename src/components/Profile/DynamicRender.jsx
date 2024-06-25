import { StateContext } from "../../context/stateContext";
import Post from "./Post";
import Replies from "./Replies";
import Retweet from "./Retweet";
import Likes from "./Likes";
import Media from "./Media";

export default function DynamicRender() {
  const { profilecomp } = StateContext();
  const component = () => {
    switch (profilecomp) {
      case "posts":
        return <Post />;

      case "replies":
        return <Replies />;

      case "retweet":
        return <Retweet />;

      case "likes":
        return <Likes />;

      case "media":
        return <Media />;

      default:
        return <Post />;
    }
  };
  return <>{component()}</>;
}
