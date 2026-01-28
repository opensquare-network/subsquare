import { useEffect } from "react";
import { isNil } from "lodash-es";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFellowshipVotes,
  clearFellowshipVotesTrigger,
  fellowshipVotesTriggerSelector,
  setFellowshipVotes,
  setIsLoadingFellowshipVotes,
} from "next-common/store/reducers/fellowship/votes";
import { partition } from "lodash-es";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import { useIsReferendumFinalState } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { backendApi } from "next-common/services/nextApi";

/**
 * // Fellowship voting storage: (pollIndex, address, VoteRecord)
 * // key u8a[] composition:
 * // 1. section + method = 32;
 * // 2. pollIndex blake_128 hash = 16;
 * // 3. pollIndex U16 4;
 * // 4. account twox_64 hash = 8;
 * // 5. account = 32;
 * // total = 92
 */
function extractPollIndexAndAddress(storageKey = []) {
  const pollIndex = storageKey.args[0].toNumber();
  const address = storageKey.args[1].toString();

  return {
    pollIndex,
    address,
  };
}

export function normalizeVotingRecord(optionalRecord) {
  if (!optionalRecord.isSome) {
    return null;
  }

  const record = optionalRecord.unwrap();
  const isAye = record.isAye;
  const votes = isAye ? record.asAye.toNumber() : record.asNay.toNumber();
  return {
    isAye,
    votes,
  };
}

export async function query(api, targetPollIndex) {
  const voting = await api.query.fellowshipCollective.voting.entries();

  const normalized = [];
  for (const [storageKey, votingOf] of voting) {
    const { pollIndex, address } = extractPollIndexAndAddress(storageKey);
    if (pollIndex !== targetPollIndex) {
      continue;
    }

    const vote = normalizeVotingRecord(votingOf);
    if (vote) {
      normalized.push({
        pollIndex,
        address,
        ...vote,
      });
    }
  }

  return normalized;
}

export const normalizeFellowshipVotes = (votes) => {
  return votes.map((vote) => ({
    ...vote,
    pollIndex: vote.referendumIndex,
    address: vote.account,
  }));
};

export const fetchFellowshipVotesFromServer = async (pollIndex) => {
  const votes = await backendApi
    .fetch(`fellowship/referenda/${pollIndex}/votes`)
    .then((res) => res.result);
  return normalizeFellowshipVotes(votes || []);
};

export const queryFellowshipVotesOnServerOrChain = async (
  api,
  pollIndex,
  isReferendumFinalState,
) => {
  if (isReferendumFinalState) {
    return await fetchFellowshipVotesFromServer(pollIndex);
  }
  if (!api) {
    return null;
  }
  return await query(api, pollIndex);
};

export default function useFellowshipVotes(pollIndex) {
  const api = useConditionalContextApi();
  const dispatch = useDispatch();
  const votesTrigger = useSelector(fellowshipVotesTriggerSelector);
  const isReferendumFinalState = useIsReferendumFinalState();

  useEffect(() => {
    if (isNil(pollIndex)) {
      return;
    }

    if (votesTrigger <= 1) {
      dispatch(setIsLoadingFellowshipVotes(true));
    }

    queryFellowshipVotesOnServerOrChain(api, pollIndex, isReferendumFinalState)
      .then((votes) => {
        if (isNil(votes)) {
          return;
        }
        const [allAye = [], allNay = []] = partition(votes, (v) => v.isAye);
        dispatch(setFellowshipVotes({ allAye, allNay }));
      })
      .finally(() => dispatch(setIsLoadingFellowshipVotes(false)));

    return () => {
      dispatch(clearFellowshipVotes());
      dispatch(clearFellowshipVotesTrigger());
    };
  }, [api, pollIndex, votesTrigger, dispatch, isReferendumFinalState]);
}
