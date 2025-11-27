import { isNil } from "lodash-es";
import { useCurrentEraStakers } from "next-common/context/staking/currentEraStakers";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";

export function useValidatorsWithStatus(validators) {
  const realAddress = useRealAddress();
  const { eraStakers, loading } = useCurrentEraStakers();
  return useMemo(() => {
    if (loading) {
      return { statuses: null, loading: true };
    }

    const waiting = [];
    const inactive = [];
    const active = [];

    (validators || []).forEach((validator) => {
      const stakerInfo = eraStakers?.find(
        (item) => item.validatorId === validator,
      );
      if (isNil(stakerInfo)) {
        waiting.push(validator);
        return;
      }
      if (
        !(stakerInfo.othersStakers ?? []).find((o) => o.who === realAddress)
      ) {
        inactive.push(validator);
        return;
      }
      active.push(validator);
    });

    return { waiting, inactive, active, loading: false };
  }, [eraStakers, loading, validators, realAddress]);
}
