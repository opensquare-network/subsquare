export default function getPostTitle(democracyVote) {
  if (!democracyVote) {
    throw new Error(
      "No myDelegatedVote given to get my delegated vote referendum title",
    );
  }

  const { referendumIndex, post } = democracyVote;
  if (post && post.title) {
    return post.title;
  }

  return `Referendum #${referendumIndex}`;
}
