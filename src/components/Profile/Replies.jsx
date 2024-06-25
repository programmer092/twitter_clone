import useGetReplies from "../../hooks/useGetReplies";
import PostModal from "../Modal/PostModal";
export default function Replies() {
  const { loading, repliedPost } = useGetReplies();

  return (
    <>
      <div className="w-full">
        {(!loading && repliedPost.length > 1) ||
        (repliedPost.length === 1 && !repliedPost[0].message) ? (
          <PostModal array={repliedPost} type="replies" />
        ) : (
          !loading && (
            <div className="flex items-center justify-center">
              Not commented on any post yet!
            </div>
          )
        )}
      </div>
    </>
  );
}
