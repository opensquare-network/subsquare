import { useMemo } from "react";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import { useTreasuryPallet } from "next-common/context/treasury";
import { SEVEN_DAYS_MS, THREE_DAYS_MS } from "next-common/utils/constants";
import { isNil } from "lodash-es";

export const defaultPendingSpends = {
  expiringSoonCount: 0,
  validSoonCount: 0,
  claimableCount: 0,
  expiringSoon: [],
  validSoon: [],
  claimable: [],
  loading: false,
};

export default function usePendingSpends() {
  const api = useContextApi();
  const treasuryPallet = useTreasuryPallet();
  const blockTime = useSelector(blockTimeSelector);
  const chainHeight = useAhmLatestHeight();

  const { value: spendsEntries, loading } = useCall(
    api?.query?.[treasuryPallet]?.spends?.entries,
    [],
  );

  const {
    expiringSoon = [],
    validSoon = [],
    claimable = [],
  } = useMemo(() => {
    if (!spendsEntries?.length || !blockTime || !chainHeight) {
      return defaultPendingSpends;
    }

    const expiringSoon = [];
    const validSoon = [];
    const claimable = [];

    spendsEntries.forEach(([storageKey, spendOption]) => {
      if (!spendOption || spendOption.isNone) {
        return;
      }

      const spend = spendOption.unwrap();
      if (spend.status.isAttempted) {
        return;
      }

      const spendId = storageKey.args[0].toNumber?.();
      const validFrom = spend.validFrom?.toNumber?.();
      const expireAt = spend.expireAt?.toNumber?.();
      const isCanClaimable = !isNil(validFrom) && chainHeight >= validFrom;
      const isNotExpired = !isNil(expireAt) && expireAt > chainHeight;

      if (expireAt && expireAt > chainHeight) {
        const heightDiff = expireAt - chainHeight;
        const timeLeftMs = BigNumber(heightDiff)
          .multipliedBy(blockTime)
          .toNumber();

        if (timeLeftMs <= SEVEN_DAYS_MS) {
          expiringSoon.push(spendId);
        }
      }

      if (validFrom && validFrom > chainHeight) {
        const heightDiff = validFrom - chainHeight;
        const timeLeftMs = BigNumber(heightDiff)
          .multipliedBy(blockTime)
          .toNumber();

        if (timeLeftMs <= THREE_DAYS_MS) {
          validSoon.push(spendId);
        }
      }

      if (isCanClaimable && isNotExpired && spend.status.isPending) {
        claimable.push(spendId);
      }
    });

    return { expiringSoon, validSoon, claimable };
  }, [spendsEntries, blockTime, chainHeight]);

  return {
    expiringSoonCount: expiringSoon?.length,
    validSoonCount: validSoon?.length,
    claimableCount: claimable?.length,
    expiringSoon,
    validSoon,
    claimable,
    loading,
  };
}
