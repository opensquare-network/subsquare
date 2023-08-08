import useApi from "next-common/utils/hooks/useApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import BigNumber from "bignumber.js";

async function queryNoVoteTracks(api, address, latestHeight) {
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

    if (!entry) {
      continue;
    }

    const prior = entry[1].asCasting.prior;
    const balance = prior[1].toString();
    const unlockAt = prior[0].toNumber();
    let unLockable = locked;
    if (latestHeight < unlockAt) {
      unLockable = new BigNumber(unLockable).minus(balance).toString();
    }

    trackLock.push({
      trackId,
      locked,
      unLockable,
      prior: {
        unlockAt,
        balance,
      },
    });
  }

  return trackLock;
}

export default function useMyClassLocksFor() {
  const api = useApi();
  const realAddress = useRealAddress();
  const latestHeight = useSelector(latestHeightSelector);
  const [trackLocks, setTrackLocks] = useState();

  useEffect(() => {
    if (!api) {
      return;
    }

    queryNoVoteTracks(api, realAddress, latestHeight).then((trackLocks) => {
      setTrackLocks(trackLocks);
    });
  }, [api, realAddress, latestHeight]);

  return trackLocks;
}
