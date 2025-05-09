import { backendApi } from "next-common/services/nextApi";
import { useEffect, useState, useCallback } from "react";
import { sortVotes } from "next-common/utils/democracy/votes/passed/common";
import { useDispatch, useSelector } from "react-redux";
import { setAllVotes } from "next-common/store/reducers/referenda/votes";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { createGlobalState } from "react-use";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";

function extractSplitVotes(vote = {}) {
  const {
    referendumIndex,
    account,
    ayeBalance,
    ayeVotes,
    nayBalance,
    nayVotes,
  } = vote;
  const common = {
    referendumIndex,
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
    referendumIndex,
    account,
    ayeBalance,
    ayeVotes,
    nayBalance,
    nayVotes,
    abstainBalance,
    abstainVotes,
  } = vote;
  const common = {
    referendumIndex,
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
  const [loaded, setLoaded] = useGlobalVotesLoadedMark();
  const dispatch = useDispatch();

  const fetch = useCallback(() => {
    if (votingFinishedHeight && loaded) {
      return Promise.resolve();
    }

    return backendApi
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

        const filteredVotes = allVotes.filter(
          (vote) =>
            BigInt(vote.votes) > 0 || BigInt(vote?.delegations?.votes || 0) > 0,
        );
        dispatch(setAllVotes(sortVotes(filteredVotes)));

        if (!loaded) {
          setLoaded(true);
        }

        return filteredVotes;
      })
      .catch((error) => {
        console.error(
          "Error fetching votes for referendum:",
          referendumIndex,
          error,
        );
      });
  }, [votingFinishedHeight, referendumIndex, dispatch, setLoaded, loaded]);

  useEffect(() => {
    return () => {
      setLoaded(false);
    };
  }, [setLoaded]);

  return { fetch };
}

export function useUpdateVotesFromServer(referendumIndex) {
  const { fetch } = useFetchVotesFromServer(referendumIndex);

  const update = useCallback(async () => {
    const times = 10;
    const blockTime =
      getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
      defaultBlockTime;

    for (let i = 0; i < times; i++) {
      try {
        await fetch();
      } catch (error) {
        console.error(
          "Error updating votes for referendum:",
          referendumIndex,
          error,
        );
      }

      if (i < times - 1) {
        await sleep(blockTime);
      }
    }
  }, [fetch, referendumIndex]);

  return { update };
}

export default function useVotesFromServer(referendumIndex) {
  const [votes, setVotes] = useState();
  const dispatch = useDispatch();
  const reduxVotes = useSelector(allVotesSelector);

  useEffect(() => {
    if (!reduxVotes) {
      backendApi
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
    const filteredVotes = allVotes.filter(
      (vote) => BigInt(vote.votes) > 0 || BigInt(vote?.delegations?.votes) > 0,
    );
    dispatch(setAllVotes(sortVotes(filteredVotes)));
  }, [votes, reduxVotes, dispatch]);
}
