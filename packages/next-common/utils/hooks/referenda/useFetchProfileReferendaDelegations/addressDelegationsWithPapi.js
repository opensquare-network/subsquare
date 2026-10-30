import { extractAddressAndTrackId } from "next-common/utils/gov2/utils";
import BigNumber from "bignumber.js";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";

function getConvictionNumber(conviction) {
  return typeof conviction === "number" ? conviction : 0;
}

function calcDelegationVotes(balance, conviction) {
  return new BigNumber(balance || 0)
    .times(convictionToLockXNumber(getConvictionNumber(conviction)))
    .toString();
}

export default async function getAddressTrackDelegationsWithPapi(papi, address) {
  // PAPI queries the finalized block by default. The list is refreshed on the
  // in-block event of our own transactions, so read the best block instead -
  // otherwise the just-included delegate/undelegate is only visible after the
  // block has been finalized.
  const voting = await papi.query.ConvictionVoting.VotingFor.getEntries(
    address,
    { at: "best" },
  );
  return voting.reduce((result, { keyArgs, value: votingOf }) => {
    const value = votingOf?.type === "Delegating" ? votingOf?.value : null;
    if (!value) {
      return result;
    }

    const [, trackIdArg] = keyArgs || [];
    const { trackId } =
      trackIdArg !== undefined
        ? { trackId: Number(trackIdArg) }
        : extractAddressAndTrackId({ args: keyArgs });

    const balance = value.balance?.toString?.() || value.balance || "0";
    const conviction = getConvictionNumber(value.conviction);
    const target = value.target?.toString?.() || value.target;
    const votes = calcDelegationVotes(balance, conviction);

    result.push({
      trackId,
      balance,
      conviction,
      target,
      votes,
    });

    return result;
  }, []);
}
