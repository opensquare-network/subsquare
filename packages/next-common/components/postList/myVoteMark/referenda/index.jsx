// packages/next-common/components/myvotes/referenda/normalizeVote.js
// packages/next-common/components/myvotes/democracy/normalize.js

import { find } from "lodash-es";
import {
  myReferendaDelegationsSelector,
  myReferendaVotingSelector,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { useSelector } from "react-redux";
import PostListMyReferendaStandardCastingVoteMark from "./casting";
import PostListMyReferendaStandardDelegatingVoteMark from "./delegating";
import PostListMyReferendaSplitVoteMark from "./split";

export default function PostListMyReferendaVoteMark({ data }) {
  const voting = useSelector(myReferendaVotingSelector);
  const delegations = useSelector(myReferendaDelegationsSelector);

  if (!voting.length) {
    return null;
  }

  const trackVoting = find(voting, { trackId: data.track });
  if (!trackVoting) {
    return null;
  }

  const isDelegating = trackVoting?.isDelegating;

  const votes = isDelegating ? trackVoting?.delegatedVotes : trackVoting?.votes;
  if (!votes?.length) {
    return null;
  }

  const vote = find(votes, { referendumIndex: data.referendumIndex })?.vote;
  if (!vote) {
    return null;
  }

  if (vote.isSplit || vote.isSplitAbstain) {
    return <PostListMyReferendaSplitVoteMark vote={vote} />;
  }

  if (isDelegating) {
    return <PostListMyReferendaStandardDelegatingVoteMark vote={vote} />;
  } else {
    const trackDelegations = find(delegations, { trackId: data.track });

    return (
      <PostListMyReferendaStandardCastingVoteMark
        vote={vote}
        delegations={trackDelegations}
      />
    );
  }
}
