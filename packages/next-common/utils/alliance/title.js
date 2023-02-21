export default function getAnnouncementTitle(post = {}) {
  if (post.title) {
    return post.title;
  }

  const { onchainData = {} } = post;
  return onchainData.cid || "--";
}
