export function getPostLastActivityAt(post) {
  if (!post) {
    return;
  }

  const lastTime = Math.max(
    new Date(post.createdAt),
    new Date(post.updatedAt),
    new Date(post.lastActivityAt),
  );

  return new Date(lastTime).toISOString();
}
