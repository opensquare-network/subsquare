import { useEffect } from "react";
import nextApi from "next-common/services/nextApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setMyVotedPosts,
  setMyVotedPostsLoading,
} from "next-common/store/reducers/myVotesSlice";
import DemocracySummary from "./summary/democracySummary";
import MyVotesList from "./myVotesList";
import useSubMyDemocracyVoting from "./democracy/useSubMyDemocracyVoting";
import useFetchDemocracyLockingPeriod from "./democracy/useFetchDemocracyLockingPeriod";
import myDemocracyVotesSelector from "next-common/store/reducers/myOnChainData/democracy/selectors/votes";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";

export default function MyDemocracyVotes() {
  const dispatch = useDispatch();
  const myDemocracyVotes = useSelector(myDemocracyVotesSelector);
  const voting = useSelector(myDemocracyVotingSelector);
  useSubMyDemocracyVoting();
  useFetchDemocracyLockingPeriod();

  useEffect(() => {
    if (!myDemocracyVotes || !myDemocracyVotes.length) {
      return;
    }

    const q = myDemocracyVotes
      .map((vote) => `referendum_index=${vote.referendumIndex}`)
      .join("&");

    dispatch(setMyVotedPostsLoading(true));
    nextApi
      .fetch(`democracy/referendums?${q}&page_size=${myDemocracyVotes.length}`)
      .then(({ result }) => {
        if (result) {
          dispatch(setMyVotedPosts(result.items));
        }
      })
      .finally(() => {
        dispatch(setMyVotedPostsLoading(false));
      });
  }, [dispatch, myDemocracyVotes]);

  return (
    <div className="flex flex-col gap-[16px]">
      <DemocracySummary />
      <MyVotesList votes={myDemocracyVotes} isLoading={!voting} />
    </div>
  );
}
