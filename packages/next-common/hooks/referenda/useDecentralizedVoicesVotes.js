import { find } from "lodash-es";
import { useChain } from "next-common/context/chain";
import { usePost } from "next-common/context/post";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { allNestedVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { getDvCandidates } from "next-common/utils/dv";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function useDecentralizedVoicesVotes() {
  const allNestedVotes = useSelector(allNestedVotesSelector);

  const chain = useChain();
  const post = usePost();
  const finishHeight = useReferendumVotingFinishHeight();

  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const candidates = getDvCandidates(chain, post.track, finishHeight);

    const dvVotes = candidates.map(({ address, role }) => {
      const vote = find(allNestedVotes, { account: address });

      return {
        account: address,
        ...vote,
        role,
      };
    });

    setVotes(dvVotes);
  }, [allNestedVotes, chain, post.track, finishHeight]);

  return votes;
}
