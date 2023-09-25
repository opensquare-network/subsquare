export default function getPostTitle(myDelegatedVote) {
  if (!myDelegatedVote) {
    throw new Error(
      "No myDelegatedVote given to get my delegated vote referendum title",
    );
  }

  const { referendumIndex, post } = myDelegatedVote;
  if (post && post.title) {
    return post.title;
  }

  return `Referendum #${referendumIndex}`;
}
