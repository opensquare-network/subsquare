import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import BigNumber from "bignumber.js";
import { extractAddressAndTrackId } from "next-common/utils/gov2/utils";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";

export default function useSubTargetReferendaDelegations() {
  const address = useRealAddress();
  const api = useContextApi();
  const profileAddress = useProfileAddress();
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !address || !profileAddress) {
      return;
    }

    setIsLoading(true);
    let unsub;

    api.query.convictionVoting.votingFor
      .entries(address, (votingEntries) => {
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

        setResult(targetDelegations);
        setIsLoading(false);
      })
      .then((unsubFn) => {
        unsub = unsubFn;
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, address, profileAddress]);

  return { result, isLoading };
}
