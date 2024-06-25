import useGetRetweetPost from "../../hooks/useGetRetweets";
import PostModal from "../Modal/PostModal";

export default function Retweet() {
  const { loading, retweetPost } = useGetRetweetPost();

  return (
    <>
      {(!loading && retweetPost.length > 1) ||
      (retweetPost.length === 1 && !retweetPost[0].message) ? (
        <PostModal array={retweetPost} type="retweet" />
      ) : (
        !loading && (
          <div className="flex w-full items-center justify-center">
            Not reposted yet!
          </div>
        )
      )}
    </>
  );
}
