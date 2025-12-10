import { isNil } from "lodash-es";
import { useCurrentEraStakers } from "next-common/context/staking/currentEraStakers";
import { useMemo } from "react";

export function useValidatorsWithStatus(nominator, validators) {
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
      if (!(stakerInfo.otherStakers ?? []).find((o) => o.who === nominator)) {
        inactive.push(validator);
        return;
      }
      active.push(validator);
    });

    return { waiting, inactive, active, loading: false };
  }, [eraStakers, loading, validators, nominator]);
}
