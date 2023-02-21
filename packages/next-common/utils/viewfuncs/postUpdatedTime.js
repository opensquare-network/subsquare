export function getPostLastActivityAt(post) {
  if (!post) {
    return;
  }

  if (post.createdAt === post.lastActivityAt) {
    return post?.indexer?.blockTime ?? post.createdAt;
  }
  return post.lastActivityAt;
}

export function getPostUpdatedAt(post) {
  if (!post) {
    return;
  }

  if (post.createdAt === post.updatedAt) {
    return post?.indexer?.blockTime ?? post.createdAt;
  }
  return post.updatedAt;
}
