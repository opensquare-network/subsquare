import { usePost } from "../context/post";

/**
 * Make sure the post is not null before rendering children
 */
export default function NonNullPost({ children }) {
  const post = usePost();

  if (!post) {
    // fixme: we should show 404 if we can not find post.
    return null;
  }

  return children;
}
