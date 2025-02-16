import nextApi from "next-common/services/nextApi";
import { useEffect, useState } from "react";
import { sortVotes } from "next-common/utils/democracy/votes/passed/common";
import { useDispatch, useSelector } from "react-redux";
import { setAllVotes } from "next-common/store/reducers/referenda/votes";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { createGlobalState } from "react-use";

function extractSplitVotes(vote = {}) {
  const { account, ayeBalance, ayeVotes, nayBalance, nayVotes } = vote;
  const common = {
    account,
    isDelegating: false,
    isSplit: true,
    conviction: 0,
  };

  let result = [];
  if (BigInt(ayeBalance) > 0) {
    result.push({
      ...common,
      balance: ayeBalance,
      aye: true,
      votes: ayeVotes,
    });
  }
  if (BigInt(nayBalance) > 0) {
    result.push({
      ...common,
      balance: nayBalance,
      aye: false,
      votes: nayVotes,
    });
  }
  return result;
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

  const result = [
    {
      ...common,
      balance: abstainBalance,
      isAbstain: true,
      conviction: 0,
      votes: abstainVotes,
    },
  ];

  if (BigInt(ayeBalance) > 0) {
    result.push({
      ...common,
      balance: ayeBalance,
      aye: true,
      conviction: 0,
      votes: ayeVotes,
    });
  }
  if (BigInt(nayBalance) > 0) {
    result.push({
      ...common,
      balance: nayBalance,
      aye: false,
      conviction: 0,
      votes: nayVotes,
    });
  }

  return result;
}

const useGlobalVotesLoadedMark = createGlobalState(false);

export function useFetchVotesFromServer(referendumIndex) {
  const votingFinishedHeight = useReferendumVotingFinishHeight();
  const height = useSelector(latestHeightSelector);
  const [loaded, setLoaded] = useGlobalVotesLoadedMark();
  const dispatch = useDispatch();

  useEffect(() => {
    if (votingFinishedHeight && loaded) {
      return;
    }

    nextApi
      .fetch(`gov2/referenda/${referendumIndex}/votes`)
      .then(({ result: votes }) => {
        const allVotes = (votes || []).reduce((result, vote) => {
          if (vote.isSplit) {
            return [...result, ...extractSplitVotes(vote)];
          } else if (vote.isSplitAbstain) {
            return [...result, ...extractSplitAbstainVotes(vote)];
          }
          return [...result, vote];
        }, []);

        const filteredVotes = allVotes.filter((vote) => BigInt(vote.votes) > 0);
        dispatch(setAllVotes(sortVotes(filteredVotes)));

        if (!loaded) {
          setLoaded(true);
        }
      });

    return () => {
      setLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [votingFinishedHeight, height, referendumIndex, dispatch, setLoaded]);
}

export default function useVotesFromServer(referendumIndex) {
  const [votes, setVotes] = useState();
  const dispatch = useDispatch();
  const reduxVotes = useSelector(allVotesSelector);

  useEffect(() => {
    if (!reduxVotes) {
      nextApi
        .fetch(`gov2/referenda/${referendumIndex}/votes`)
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
      } else if (vote.isSplitAbstain) {
        return [...result, ...extractSplitAbstainVotes(vote)];
      }
      return [...result, vote];
    }, []);
    const filteredVotes = allVotes.filter((vote) => BigInt(vote.votes) > 0);
    dispatch(setAllVotes(sortVotes(filteredVotes)));
  }, [votes, reduxVotes, dispatch]);
}
