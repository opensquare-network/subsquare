import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { setAllVotes } from "next-common/store/reducers/democracy/votes";
import { useDispatch } from "react-redux";
import { sortVotes } from "next-common/utils/democracy/votes/passed/common";

function extractSplitVotes(vote = {}) {
  const { account, ayeBalance, ayeVotes, nayBalance, nayVotes } = vote;
  const common = {
    account,
    isDelegating: false,
    isSplit: true,
    conviction: 0,
  };
  return [
    {
      ...common,
      balance: ayeBalance,
      aye: true,
      votes: ayeVotes,
    },
    {
      ...common,
      balance: nayBalance,
      aye: false,
      votes: nayVotes,
    },
  ];
}

export default function useDemocracyVotesFromServer(referendumIndex) {
  const [votes, setVotes] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    nextApi.fetch(`democracy/referenda/${ referendumIndex }/votes`)
      .then(({ result: votes }) => setVotes(votes));
  }, [referendumIndex]);

  useEffect(() => {
    if (!votes) {
      return;
    }

    const allVotes = (votes || []).reduce((result, vote) => {
      if (vote.isSplit) {
        return [...result, ...extractSplitVotes(vote)];
      }
      return [...result, vote];
    }, []);

    dispatch(setAllVotes(sortVotes(allVotes)));
  });
}
