export default function getMetaDesc(post) {
  let contentDesc = "";
  const maxDescLength = 60;
  if (post.content) {
    if (post.content.length > maxDescLength) {
      contentDesc = post.content.substr(0, maxDescLength) + "...";
    } else {
      contentDesc = post.content;
    }
  }
  return contentDesc;
}
