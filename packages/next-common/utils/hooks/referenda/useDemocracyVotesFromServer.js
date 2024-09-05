import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { setAllVotes } from "next-common/store/reducers/democracy/votes";
import { useDispatch, useSelector } from "react-redux";
import { sortVotes } from "next-common/utils/democracy/votes/passed/common";
import { allVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";

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
  const reduxVotes = useSelector(allVotesSelector);

  useEffect(() => {
    if (!reduxVotes) {
      nextApi
        .fetch(`democracy/referenda/${referendumIndex}/votes`)
        .then(({ result: votes }) => setVotes(votes));
    }
  }, [referendumIndex, reduxVotes]);

  useEffect(() => {
    if (!votes || reduxVotes) {
      return;
    }

    const allVotes = (votes || []).reduce((result, vote) => {
      if (vote.isSplit) {
        return [...result, ...extractSplitVotes(vote)];
      }
      return [...result, vote];
    }, []);

    dispatch(setAllVotes(sortVotes(allVotes)));
  }, [votes, reduxVotes, dispatch]);
}
