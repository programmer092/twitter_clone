import useGetPost from "../../hooks/useGetPosts";
import PostModal from "../Modal/PostModal";

export default function Post() {
  const { post, loading } = useGetPost();

  return (
    <>
      {(!loading && post.length > 1) ||
      (post.length === 1 && !post[0].message) ? (
        <PostModal array={post} type="post" />
      ) : (
        !loading && (
          <div className="flex items-center justify-center">No posts yet.</div>
        )
      )}
    </>
  );
}
