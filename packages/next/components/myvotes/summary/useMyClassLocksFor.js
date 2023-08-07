import useApi from "next-common/utils/hooks/useApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useState } from "react";

async function queryNoVoteTracks(api, address) {
  const [entries, classLocks] = await Promise.all([
    api.query.convictionVoting.votingFor.entries(address),
    api?.query?.convictionVoting?.classLocksFor(address),
  ]);

  const trackLock = [];
  for (const [trackId, locked] of classLocks.toJSON()) {
    const entry = entries.find((entry) => {
      const [storageKey, votingOf] = entry;
      if (storageKey.args[1].toNumber() !== trackId) {
        return false;
      }

      if (votingOf.isDelegating) {
        return false;
      }
      return votingOf.asCasting.votes.length <= 0;
    });

    if (entry) {
      const prior = entry[1].asCasting.prior;
      trackLock.push({
        trackId,
        locked,
        prior: {
          unlockAt: prior[0].toNumber(),
          balance: prior[1].toString(),
        },
      });
    }
  }

  return trackLock;
}

export default function useMyClassLocksFor() {
  const api = useApi();
  const realAddress = useRealAddress();
  const [trackLocks, setTrackLocks] = useState();
  useEffect(() => {
    if (!api) {
      return;
    }

    queryNoVoteTracks(api, realAddress).then((trackLocks) => {
      setTrackLocks(trackLocks);
    });
  }, [api, realAddress]);

  return trackLocks;
}
