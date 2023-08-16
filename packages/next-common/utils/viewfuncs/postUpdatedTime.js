export function getPostLastActivityAt(post) {
  if (!post) {
    return;
  }

  const latestTime = Math.max(
    new Date(post.createdAt || 0),
    new Date(post.updatedAt || 0),
    new Date(post.originalCreatedAt || 0),
    new Date(post.originalUpdatedAt || 0),
    new Date(post.lastActivityAt || 0),
  );

  return new Date(latestTime).toISOString();
}
