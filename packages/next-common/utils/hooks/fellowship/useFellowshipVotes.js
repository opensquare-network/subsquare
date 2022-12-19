import useApi from "../useApi";
import { useEffect, useState } from "react";
import isNil from "lodash.isnil";
import { encodeAddress } from "@polkadot/keyring";

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
function extractPollIndexAndAddress(storageKey = [], api) {
  const sectionRemoved = storageKey.slice(32);
  const pollIndexHashRemoved = sectionRemoved.slice(16);
  const pollIndexU8a = pollIndexHashRemoved.slice(0, 4);

  const pollIndex = api.registry.createType("U16", pollIndexU8a).toNumber();
  const pollIndexRemoved = pollIndexHashRemoved.slice(4);

  // left 32 byte is the account id
  const accountHashRemoved = pollIndexRemoved.slice(8);
  const address = encodeAddress(accountHashRemoved, api.registry.chainSS58);

  return {
    pollIndex,
    address,
  };
}

function normalizeVotingRecord(optionalRecord) {
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

async function query(api, targetPollIndex, blockHeight) {
  let blockApi = api;
  if (blockHeight) {
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    blockApi = await api.at(blockHash);
  }

  const voting = await blockApi.query.fellowshipCollective.voting.entries();

  const normalized = [];
  for (const [storageKey, votingOf] of voting) {
    const { pollIndex, address } = extractPollIndexAndAddress(storageKey, api);
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

export default function useFellowshipVotes(pollIndex, blockHeight) {
  const api = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    if (!api || isNil(pollIndex)) {
      return;
    }

    setIsLoading(true);
    query(api, pollIndex, blockHeight)
      .then((votes) => setVotes(votes))
      .finally(() => setIsLoading(false));
  }, [api, pollIndex, blockHeight]);

  return { votes, isLoading };
}
