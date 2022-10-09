export default function isThumbUp(user, post) {
  if (!user) {
    return false
  }

  return post.reactions?.findIndex((r) => r.user?.username === user.username) > -1;
}
