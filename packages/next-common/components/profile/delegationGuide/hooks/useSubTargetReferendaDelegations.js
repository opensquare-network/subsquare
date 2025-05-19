import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useContextApi } from "next-common/context/api";
import { useCallback, useMemo, useState } from "react";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import BigNumber from "bignumber.js";
import { extractAddressAndTrackId } from "next-common/utils/gov2/utils";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";
import useCall from "next-common/utils/hooks/useCall";
import { useChainSettings } from "next-common/context/chain";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";

export default function useSubTargetReferendaDelegations() {
  const address = useRealAddress();
  const api = useContextApi();
  const profileAddress = useProfileAddress();
  const [trigger, setTrigger] = useState(0);
  const { blockTime } = useChainSettings();
  const timer = blockTime || defaultBlockTime;

  const fetch = useCallback(async () => {
    for (let i = 0; i < 3; i++) {
      setTrigger((prev) => prev + 1);
      await sleep(timer);
    }
  }, [timer]);

  const { value: votingEntries, loaded } = useCall(
    api?.query.convictionVoting.votingFor.entries,
    [address],
    { trigger },
  );

  const result = useMemo(() => {
    if (!votingEntries || !profileAddress) {
      return [];
    }

    const targetDelegations = votingEntries.reduce(
      (result, [storageKey, votingOf]) => {
        if (votingOf.isDelegating) {
          const asDelegating = votingOf.asDelegating;
          const target = asDelegating.target.toString();

          if (target !== profileAddress) {
            return result;
          }

          const { trackId } = extractAddressAndTrackId(storageKey);
          const balance = asDelegating.balance.toString();
          const conviction = asDelegating.conviction.toNumber();
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
      },
      [],
    );

    return (targetDelegations || [])?.sort((a, b) => a.trackId - b.trackId);
  }, [votingEntries, profileAddress]);

  return { result, isLoading: !loaded, fetch };
}
