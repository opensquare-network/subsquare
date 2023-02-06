import { usePost } from "../context/post";

/**
 * Make sure the post is not null before rendering children
 */
export default function NonNullPost({ children }) {
  const post = usePost();

  if (!post) {
    return null;
  }

  return children;
}
