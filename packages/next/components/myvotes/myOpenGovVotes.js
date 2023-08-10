import useAccountVotes from "next-common/hooks/referenda/votes/useAccountVotes";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect } from "react";
import nextApi from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import { setMyVotedPosts } from "next-common/store/reducers/myVotesSlice";
import MyVotesList from "./myVotesList";
import ReferendaSummary from "./summary/referendaSummary";
import useFetchMyReferendaVoting from "./referenda/useFetchMyReferendaVoting";
import useSubClassLocks from "./referenda/useSubClassLocks";

export default function MyOpenGovVotes() {
  const dispatch = useDispatch();
  const realAddress = useRealAddress();
  const { isLoading, votes, priors } = useAccountVotes(realAddress);
  useFetchMyReferendaVoting();
  useSubClassLocks();

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

  return (
    <div className="flex flex-col gap-[16px]">
      <ReferendaSummary votes={votes} priors={priors} />
      <MyVotesList isLoading={isLoading} votes={votes} />
    </div>
  );
}
