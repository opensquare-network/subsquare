import { isNaN } from "lodash-es";

export function getPostLastActivityAt(post) {
  if (!post) {
    return;
  }

  const lastTime = Math.max(
    new Date(post.createdAt),
    new Date(post.updatedAt),
    new Date(post.lastActivityAt),
  );

  if (isNaN(lastTime)) {
    return;
  }

  return new Date(lastTime).toISOString();
}
