import useAccountVotes from "next-common/hooks/referenda/votes/useAccountVotes";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import CommonVotes from "./commonVotes";
import { useEffect } from "react";
import nextApi from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import { setMyVotedPosts } from "next-common/store/reducers/myVotesSlice";

export default function MyOpenGovVotes() {
  const dispatch = useDispatch();
  const realAddress = useRealAddress();
  const { isLoading, votes, priors } = useAccountVotes(realAddress);

  useEffect(() => {
    if (!votes || !votes.length) {
      return;
    }

    const q = votes
      .map((vote) => `referendum_index=${vote.referendumIndex}`)
      .join("&");

    nextApi
      .fetch(`gov2/referendums?${q}&page_size=${votes.length}`)
      .then(({ result }) => {
        if (result) {
          dispatch(setMyVotedPosts(result.items));
        }
      });
  }, [dispatch, votes]);

  return <CommonVotes votes={votes} priors={priors} isLoading={isLoading} />;
}
