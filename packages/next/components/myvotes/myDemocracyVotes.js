import useAccountDemocracyVotes from "next-common/hooks/democracy/votes/useAccountDemocracyVotes";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect } from "react";
import nextApi from "next-common/services/nextApi";
import { useDispatch } from "react-redux";
import { setMyVotedPosts } from "next-common/store/reducers/myVotesSlice";
import DemocracySummary from "./summary/democracySummary";
import MyVotesList from "./myVotesList";
import useFetchMyDemocracyVoting from "./democracy/useFetchMyDemocracyVoting";
import useFetchDemocracyLockingPeriod from "./democracy/useFetchDemocracyLockingPeriod";

export default function MyDemocracyVotes() {
  const dispatch = useDispatch();
  const realAddress = useRealAddress();
  const { isLoading, votes } = useAccountDemocracyVotes(realAddress);
  useFetchMyDemocracyVoting();
  useFetchDemocracyLockingPeriod();

  useEffect(() => {
    if (!votes || !votes.length) {
      return;
    }

    const q = votes
      .map((vote) => `referendum_index=${vote.referendumIndex}`)
      .join("&");

    nextApi
      .fetch(`democracy/referendums?${q}&page_size=${votes.length}`)
      .then(({ result }) => {
        if (result) {
          dispatch(setMyVotedPosts(result.items));
        }
      });
  }, [dispatch, votes]);

  return (
    <div className="flex flex-col gap-[16px]">
      <DemocracySummary />
      <MyVotesList isLoading={isLoading} votes={votes} />
    </div>
  );
}
