import { find } from "lodash-es";
import { useMyCollectivesVotes } from "next-common/hooks/referenda/useMyCollectivesVotes";
import PostListMyVoteMarkTemplate from "./template";

export default function PostListMyFellowshipReferendaVoteMark({ data }) {
  const { votes } = useMyCollectivesVotes();
  if (!votes?.length) {
    return null;
  }

  const vote = find(votes, { referendumIndex: data.referendumIndex });
  if (!vote) {
    return null;
  }

  const items = [
    {
      label: "Vote",
      value: vote?.isAye === false ? "Nay" : "Aye",
    },
    {
      label: "Votes",
      value: vote.votes,
    },
  ];

  return (
    <PostListMyVoteMarkTemplate
      items={items}
      isAye={vote?.isAye === true}
      isNay={vote?.isAye === false}
    />
  );
}
