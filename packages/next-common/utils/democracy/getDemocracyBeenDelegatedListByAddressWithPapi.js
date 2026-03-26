import { isSameAddress } from "..";
import { Conviction } from "../referendumCommon";
import { calcVotes } from "./votes/passed/common";

let votingOfEntries;

export async function getDemocracyBeenDelegatedListByAddressWithPapi(
  papi,
  address,
) {
  if (!votingOfEntries) {
    votingOfEntries = await papi?.query.Democracy.VotingOf.getEntries();
  }

  const beenDelegated = [];
  for (const entry of votingOfEntries || []) {
    const account = entry?.keyArgs?.[0];
    const voting = entry?.value;

    if (voting?.type !== "Delegating") {
      continue;
    }

    const delegating = voting?.value;
    if (!delegating || !isSameAddress(delegating.target, address)) {
      continue;
    }

    const conviction = Conviction[delegating.conviction.type];
    const votes = calcVotes(delegating.balance?.toString(), conviction);

    beenDelegated.push({
      delegator: account,
      ...delegating,
      conviction,
      votes,
    });
  }

  return beenDelegated;
}
