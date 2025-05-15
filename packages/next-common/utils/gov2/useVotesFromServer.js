import { backendApi } from "next-common/services/nextApi";
import { useEffect, useState, useMemo, useCallback } from "react";
import { sortVotes } from "next-common/utils/democracy/votes/passed/common";
// import { useDispatch } from "react-redux";
// import {
//   setAllVotes,
//   setLoading,
// } from "next-common/store/reducers/referenda/votes";
// import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
// import { createGlobalState } from "react-use";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";
import {
  getOrCreateStorage,
  STORAGE_ITEM_KEY,
  STORAGE_NAMES,
} from "next-common/utils/indexedDB/votes";
import { flatten } from "lodash-es";
import BigNumber from "bignumber.js";
import { isSameAddress } from "next-common/utils";

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

// const useGlobalVotesLoadedMark = createGlobalState(false);

export function useReferendaVotes(referendumIndex) {
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const allVotesStorage = useMemo(
    () =>
      getOrCreateStorage(
        `${STORAGE_NAMES.REFERENDA_ALL_VOTES}-${referendumIndex}`,
      ),
    [referendumIndex],
  );

  const getVotesFromStorage = useCallback(async () => {
    if (!allVotesStorage) {
      return [];
    }
    try {
      const storedVotes = await allVotesStorage.getItem(
        STORAGE_ITEM_KEY.ALLVOTES,
      );
      return storedVotes || [];
    } catch (error) {
      console.error("Error reading votes from IndexedDB:", error);
      return [];
    }
  }, [allVotesStorage]);

  useEffect(() => {
    setIsLoading(true);
    getVotesFromStorage()
      .then((storedResult) => {
        setResult(storedResult);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [getVotesFromStorage]);

  const allVotes = result;

  const showVotesNumber = !!allVotes;

  const allAye = (allVotes || []).filter((v) => v.aye);
  const allAyeDelegationVotes = allAye.filter((v) => v.isDelegating);
  const allAyeDirectVotes = allAye.filter((v) => !v.isDelegating);

  const allNay = (allVotes || []).filter((v) => v.aye === false);
  const allNayDelegationVotes = allNay.filter((v) => v.isDelegating);
  const allNayDirectVotes = allNay.filter((v) => !v.isDelegating);

  const allAbstain = (allVotes || []).filter((v) => v.isAbstain);
  const allAbstainDelegationVotes = allAbstain.filter((v) => v.isDelegating);
  const allAbstainDirectVotes = allAbstain.filter((v) => !v.isDelegating);

  const allDirectVotes = (allVotes || []).filter((v) => !v.isDelegating);
  const allDelegationVotes = (allVotes || []).filter((v) => v.isDelegating);

  const normalizedNestedVote = (vote, delegations) => {
    if (!vote.isStandard) {
      return {
        ...vote,
        directVoterDelegations: [],
        totalVotes: vote.votes,
        totalDelegatedVotes: 0,
        totalDelegatedCapital: 0,
      };
    }

    let directVoterDelegations = delegations.filter((delegationVote) =>
      isSameAddress(delegationVote.target, vote.account),
    );
    const allDelegationVotes = directVoterDelegations.reduce((result, d) => {
      return new BigNumber(result).plus(d.votes).toString();
    }, 0);
    const totalVotes = new BigNumber(vote.votes)
      .plus(allDelegationVotes)
      .toString();
    const totalDelegatedVotes = directVoterDelegations.reduce((result, d) => {
      return BigNumber(result).plus(d.votes).toString();
    }, 0);
    const totalDelegatedCapital = directVoterDelegations.reduce((result, d) => {
      return BigNumber(result).plus(d.balance).toString();
    }, 0);

    return {
      ...vote,
      directVoterDelegations,
      totalVotes,
      totalDelegatedVotes,
      totalDelegatedCapital,
    };
  };

  const directVotesWithNested = allDirectVotes.map((v) =>
    normalizedNestedVote(v, allDelegationVotes),
  );

  const nestedVotes = {
    allAye: directVotesWithNested.filter((v) => v.aye),
    allNay: directVotesWithNested.filter((v) => v.aye === false),
    allAbstain: directVotesWithNested.filter((v) => v.isAbstain),
  };

  const allNestedVotes = flatten([
    nestedVotes.allAye,
    nestedVotes.allNay,
    nestedVotes.allAbstain,
  ]);

  const flattenVotes = {
    allAye,
    allNay,
    allAbstain,
  };

  return {
    isLoading,
    result: allVotes,
    showVotesNum: showVotesNumber,
    allAye,
    allAyeDelegationVotes,
    allAyeDirectVotes,
    allNay,
    allNayDelegationVotes,
    allNayDirectVotes,
    allAbstain,
    allAbstainDelegationVotes,
    allAbstainDirectVotes,
    allDirectVotes,
    allDelegationVotes,
    nestedVotes,
    allNestedVotes,
    flattenVotes,
  };
}

export function useReferendaVotesActions(referendumIndex) {
  const allVotesStorage = useMemo(
    () =>
      getOrCreateStorage(
        `${STORAGE_NAMES.REFERENDA_ALL_VOTES}-${referendumIndex}`,
      ),
    [referendumIndex],
  );

  const processVotes = useCallback((votes) => {
    if (!votes) {
      return [];
    }

    const allVotesRaw = (votes || []).reduce((acc, vote) => {
      if (vote.isSplit) {
        return [...acc, ...extractSplitVotes(vote)];
      } else if (vote.isSplitAbstain) {
        return [...acc, ...extractSplitAbstainVotes(vote)];
      }
      return [...acc, vote];
    }, []);

    const filteredVotes = allVotesRaw.filter(
      (vote) =>
        BigInt(vote.votes) > 0 || BigInt(vote?.delegations?.votes || 0) > 0,
    );

    return sortVotes(filteredVotes);
  }, []);

  const fetch = useCallback(async () => {
    try {
      const { result: votes } = await backendApi.fetch(
        `gov2/referenda/${referendumIndex}/votes`,
      );

      const processedVotes = processVotes(votes);

      try {
        await allVotesStorage?.setItem(
          STORAGE_ITEM_KEY.ALLVOTES,
          processedVotes,
        );
      } catch (error) {
        console.error("Error saving votes to IndexedDB:", error);
      }

      return processedVotes;
    } catch (error) {
      console.error(
        "Error fetching votes for referendum:",
        referendumIndex,
        error,
      );
      throw new Error("Error fetching votes for referendum");
    }
  }, [referendumIndex, allVotesStorage, processVotes]);

  const update = useCallback(
    async (times = 10) => {
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
    },
    [fetch, referendumIndex],
  );

  const clearStorage = useCallback(async () => {
    try {
      await allVotesStorage?.removeItem(STORAGE_ITEM_KEY.ALLVOTES);
    } catch (error) {
      console.error("Error removing item from IndexedDB:", error);
    }
  }, [allVotesStorage]);

  return { fetch, update, clearStorage };
}

// export function useFetchVotesFromServer(referendumIndex) {
//   const votingFinishedHeight = useReferendumVotingFinishHeight();
//   const [loaded, setLoaded] = useGlobalVotesLoadedMark();
//   const dispatch = useDispatch();

//   const fetch = useCallback(() => {
//     if (votingFinishedHeight && loaded) {
//       return Promise.resolve();
//     }
//     dispatch(setLoading(true));

//     return backendApi
//       .fetch(`gov2/referenda/${referendumIndex}/votes`)
//       .then(({ result: votes }) => {
//         const allVotes = (votes || []).reduce((result, vote) => {
//           if (vote.isSplit) {
//             return [...result, ...extractSplitVotes(vote)];
//           } else if (vote.isSplitAbstain) {
//             return [...result, ...extractSplitAbstainVotes(vote)];
//           }
//           return [...result, vote];
//         }, []);

//         const filteredVotes = allVotes.filter(
//           (vote) =>
//             BigInt(vote.votes) > 0 || BigInt(vote?.delegations?.votes || 0) > 0,
//         );

//         dispatch(setAllVotes(sortVotes(filteredVotes)));

//         if (!loaded) {
//           setLoaded(true);
//         }

//         return filteredVotes;
//       })
//       .catch((error) => {
//         console.error(
//           "Error fetching votes for referendum:",
//           referendumIndex,
//           error,
//         );
//         throw new Error("Error fetching votes for referendum");
//       })
//       .finally(() => {
//         setTimeout(() => dispatch(setLoading(false)), 1);
//       });
//   }, [votingFinishedHeight, referendumIndex, dispatch, setLoaded, loaded]);

//   useEffect(() => {
//     return () => {
//       setLoaded(false);
//     };
//   }, [setLoaded]);

//   return { fetch };
// }

// export function useUpdateVotesFromServer(referendumIndex) {
//   const { fetch } = useFetchVotesFromServer(referendumIndex);

//   const update = useCallback(async () => {
//     const times = 10;
//     const blockTime =
//       getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
//       defaultBlockTime;

//     for (let i = 0; i < times; i++) {
//       try {
//         await fetch();
//       } catch (error) {
//         console.error(
//           "Error updating votes for referendum:",
//           referendumIndex,
//           error,
//         );
//       }

//       if (i < times - 1) {
//         await sleep(blockTime);
//       }
//     }
//   }, [fetch, referendumIndex]);

//   return { update };
// }

// export default function useVotesFromServer(referendumIndex) {
//   const [votes, setVotes] = useState();
//   const { result } = useAllReferendaVotes(referendumIndex);
//   const dispatch = useDispatch();
//   const reduxVotes = useSelector(allVotesSelector);

//   useEffect(() => {
//     if (!reduxVotes && result.length === 0) {
//       fetch().then((processedVotes) => {
//         dispatch(setAllVotes(processedVotes));
//       });
//     } else if (!reduxVotes && result.length > 0) {
//       dispatch(setAllVotes(result));
//     }
//   }, [referendumIndex, reduxVotes, result, dispatch, fetch]);

//   return result;
// }
