import { find } from "lodash-es";
import { useChain } from "next-common/context/chain";
import { usePost } from "next-common/context/post";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import getDvAddresses from "next-common/utils/dv";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function useDecentralizedVoicesVotes() {
  const allVotes = useSelector(allVotesSelector);
  const chain = useChain();
  const post = usePost();
  const finishHeight = useReferendumVotingFinishHeight();

  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const addresses = getDvAddresses(chain, post.track, finishHeight);

    const dvVotes = addresses.map((address) => {
      return {
        account: address,
        ...find(allVotes, { account: address }),
      };
    });

    setVotes(dvVotes);
  }, [allVotes, chain, post.track]);

  return votes;
}
