import { extractAddressAndTrackId } from "next-common/utils/gov2/utils";

export default function normalizeVotingOfEntry([storageKey, voting]) {
  const { address, trackId } = extractAddressAndTrackId(storageKey);
  return { account: address, trackId, voting };
}
