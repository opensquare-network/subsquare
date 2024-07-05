export function isLinkedToSimaDiscussion(post) {
  return (
    post.refToPost?.postType === "post" && post.refToPost?.dataSource === "sima"
  );
}

export function isLinkedToOffChainDiscussion(post) {
  return (
    post.refToPost?.postType === "post" && post.refToPost?.dataSource !== "sima"
  );
}
