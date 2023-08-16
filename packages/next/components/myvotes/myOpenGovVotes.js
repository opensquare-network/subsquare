import { useEffect } from "react";
import nextApi from "next-common/services/nextApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setMyVotedPosts,
  setMyVotedPostsLoading,
} from "next-common/store/reducers/myVotesSlice";
import MyVotesList from "./myVotesList";
import ReferendaSummary from "./summary/referendaSummary";
import useFetchMyReferendaVoting from "./referenda/useFetchMyReferendaVoting";
import useSubClassLocks from "./referenda/useSubClassLocks";
import useFetchReferendaLockingPeriod from "./referenda/useFetchReferendaLockingPeriod";
import myReferendaVotesSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/votes";
import { isLoadingReferendaVotingSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";

export default function MyOpenGovVotes() {
  const dispatch = useDispatch();
  const referendaVotes = useSelector(myReferendaVotesSelector);
  const isLoading = useSelector(isLoadingReferendaVotingSelector);
  useFetchMyReferendaVoting();
  useSubClassLocks();
  useFetchReferendaLockingPeriod();

  useEffect(() => {
    if (!referendaVotes || !referendaVotes.length) {
      return;
    }

    const q = referendaVotes
      .map((vote) => `referendum_index=${vote.referendumIndex}`)
      .join("&");

    dispatch(setMyVotedPostsLoading(true));
    nextApi
      .fetch(`gov2/referendums?${q}&page_size=${referendaVotes.length}`)
      .then(({ result }) => {
        if (result) {
          dispatch(setMyVotedPosts(result.items));
        }
      })
      .finally(() => {
        dispatch(setMyVotedPostsLoading(false));
      });
  }, [dispatch, referendaVotes]);

  return (
    <div className="flex flex-col gap-[16px]">
      <ReferendaSummary />
      <MyVotesList votes={referendaVotes} isLoading={isLoading} />
    </div>
  );
}
