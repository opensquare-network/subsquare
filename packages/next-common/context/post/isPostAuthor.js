export default function isPostAuthor(user, post, type) {
  if (!user) {
    return false;
  }

  if (type === "post") {
    return post.author?.username === user.username;
  }

  return post?.authors?.includes(user.address);
}
