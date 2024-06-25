import useGetLikedPost from "../../hooks/useGetLikedPost";
import PostModal from "../Modal/PostModal";

export default function Likes() {
  const { LikedPost, loading } = useGetLikedPost();

  return (
    <>
      {(!loading && LikedPost.length > 1) ||
      (LikedPost.length === 1 && !LikedPost[0].message) ? (
        <PostModal array={LikedPost} type="like" />
      ) : (
        !loading && (
          <div className="flex items-center justify-center">
            No liked posts yet.
          </div>
        )
      )}
    </>
  );
}
