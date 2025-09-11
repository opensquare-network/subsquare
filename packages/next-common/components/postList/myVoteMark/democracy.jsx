// packages/next-common/components/myvotes/democracy/normalize.js

import { find, isNil, merge, pick } from "lodash-es";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import { useSelector } from "react-redux";
import PostListMyReferendaStandardDelegatingVoteMark from "./referenda/delegating";
import PostListMyReferendaSplitVoteMark from "./referenda/split";
import PostListMyReferendaStandardCastingVoteMark from "./referenda/casting";

export default function PostListMyDemocracyReferendaVoteMark({ data }) {
  const voting = useSelector(myDemocracyVotingSelector);

  if (isNil(voting)) {
    return null;
  }

  const isDelegating = voting?.isDelegating;

  const votes = isDelegating ? voting.delegatedVotes : voting.votes;
  if (!votes?.length) {
    return null;
  }

  const vote = find(votes, { referendumIndex: data.referendumIndex })?.vote;
  if (!vote) {
    return null;
  }

  if (vote.isSplit) {
    return <PostListMyReferendaSplitVoteMark vote={vote} />;
  }

  if (isDelegating) {
    return (
      <PostListMyReferendaStandardDelegatingVoteMark
        vote={merge({}, vote, pick(voting, ["balance", "conviction"]))}
      />
    );
  } else {
    return (
      <PostListMyReferendaStandardCastingVoteMark
        vote={vote}
        delegations={voting.delegations}
      />
    );
  }
}
