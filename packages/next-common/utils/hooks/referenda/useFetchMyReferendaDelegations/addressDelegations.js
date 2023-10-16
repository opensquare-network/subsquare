import { extractAddressAndTrackId } from "next-common/utils/gov2/utils";

export default async function getAddressTrackDelegations(api, address) {
  const voting = await api.query.convictionVoting.votingFor.entries(address);
  return voting.reduce((result, [storageKey, votingOf]) => {
    if (votingOf.isDelegating) {
      const { trackId } = extractAddressAndTrackId(storageKey);
      const asDelegating = votingOf.asDelegating;
      result.push({
        trackId,
        balance: asDelegating.balance.toString(),
        conviction: asDelegating.conviction.toNumber(),
        target: asDelegating.target.toString(),
      });
    }

    return result;
  }, []);
}
