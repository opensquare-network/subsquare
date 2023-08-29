import nextApi from "next-common/services/nextApi";
import { useEffect, useState } from "react";
import { sortVotes } from "next-common/utils/democracy/votes/passed/common";
import BigNumber from "bignumber.js";
import { useDispatch } from "react-redux";
import { setAllVotes } from "next-common/store/reducers/referenda/votes";

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

function extractSplitAbstainVotes(vote = {}) {
  const {
    account,
    ayeBalance,
    ayeVotes,
    nayBalance,
    nayVotes,
    abstainBalance,
    abstainVotes,
  } = vote;
  const common = {
    account,
    isDelegating: false,
    isSplitAbstain: true,
  };

  return [
    {
      ...common,
      balance: abstainBalance,
      isAbstain: true,
      conviction: 0,
      votes: abstainVotes,
    },
    {
      ...common,
      balance: ayeBalance,
      aye: true,
      conviction: 0,
      votes: ayeVotes,
    },
    {
      ...common,
      balance: nayBalance,
      aye: false,
      conviction: 0,
      votes: nayVotes,
    },
  ];
}

export default function useVotesFromServer(referendumIndex) {
  const [votes, setVotes] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    nextApi
      .fetch(`gov2/referenda/${referendumIndex}/votes`)
      .then(({ result: votes }) => setVotes(votes));
  }, [referendumIndex]);

  useEffect(() => {
    if (!votes) {
      return;
    }

    const allVotes = (votes || [])
      .reduce((result, vote) => {
        if (vote.isSplit) {
          return [...result, ...extractSplitVotes(vote)];
        } else if (vote.isSplitAbstain) {
          return [...result, ...extractSplitAbstainVotes(vote)];
        }
        return [...result, vote];
      }, [])
      .filter((v) => new BigNumber(v.balance).gt(0));

    dispatch(setAllVotes(sortVotes(allVotes)));
  }, [votes]);
}
