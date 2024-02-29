import BigNumber from "bignumber.js";
import { extractAddressAndTrackId } from "next-common/utils/gov2/utils";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";

export default async function getAddressTrackDelegations(api, address) {
  const voting = await api.query.convictionVoting.votingFor.entries(address);
  return voting.reduce((result, [storageKey, votingOf]) => {
    if (votingOf.isDelegating) {
      const { trackId } = extractAddressAndTrackId(storageKey);
      const asDelegating = votingOf.asDelegating;
      const balance = asDelegating.balance.toString();
      const conviction = asDelegating.conviction.toNumber();
      const target = asDelegating.target.toString();
      const votes = new BigNumber(balance)
        .times(convictionToLockXNumber(conviction))
        .toString();

      result.push({
        trackId,
        balance,
        conviction,
        target,
        votes,
      });
    }

    return result;
  }, []);
}
