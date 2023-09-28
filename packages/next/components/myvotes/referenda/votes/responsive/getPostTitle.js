import isNil from "lodash.isnil";
import startCase from "lodash.startcase";

export default function getPostTitle(myReferendaVote, tracks = []) {
  const { post, trackId, referendumIndex } = myReferendaVote;
  if (post?.title) {
    return post.title;
  }

  if (isNil(trackId)) {
    return `Referendum #${referendumIndex}`;
  }

  const track = tracks.find((t) => t.id === trackId);
  if (track) {
    return `[${startCase(track.name)}] Referendum #${referendumIndex}`;
  }

  return `[Track ${trackId}] Referendum #${referendumIndex}`;
}
