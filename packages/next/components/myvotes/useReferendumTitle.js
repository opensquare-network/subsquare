import { usePageProps } from "next-common/context/page";
import startCase from "lodash.startcase";
import useVotedPost from "./useVotedPost";
import isNil from "lodash.isnil";

export default function useReferendumTitle({ trackId, referendumIndex }) {
  const { tracks } = usePageProps();
  const post = useVotedPost(referendumIndex);
  if (post?.title) {
    return post.title;
  }

  let trackPrefix = "";
  if (!isNil(trackId)) {
    const track = tracks.find((t) => t.id === trackId);
    if (track) {
      trackPrefix = `[${startCase(track.name)}] `;
    } else {
      trackPrefix = `[Track ${trackId}] `;
    }
  }

  return `${trackPrefix} Referendum #${referendumIndex}`;
}
