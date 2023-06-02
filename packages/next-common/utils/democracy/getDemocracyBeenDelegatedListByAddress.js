import { isSameAddress } from "..";
import { Conviction } from "../referendumCommon";
import { calcVotes, normalizeVotingOfEntry } from "./votes/passed/common";

let votingOfEntries;

export async function getDemocracyBeenDelegatedListByAddress(api, address) {
  if (!votingOfEntries) {
    votingOfEntries = await api.query.democracy?.votingOf.entries();
  }

  const beenDelegated = [];
  for (const entry of votingOfEntries || []) {
    const { account, voting } = normalizeVotingOfEntry(entry);
    if (!voting.isDelegating) {
      continue;
    }

    const delegating = voting.asDelegating.toJSON();
    if (isSameAddress(delegating.target, address)) {
      const conviction = Conviction[delegating.conviction];
      const votes = calcVotes(delegating.balance, conviction);

      beenDelegated.push({
        delegator: account,
        ...delegating,
        conviction,
        votes,
      });
    }
  }

  return beenDelegated;
}
