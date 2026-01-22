import { useMemo } from "react";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import { useTreasuryPallet } from "next-common/context/treasury";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export default function usePendingSpends() {
  const api = useContextApi();
  const treasuryPallet = useTreasuryPallet();
  const blockTime = useSelector(blockTimeSelector);
  const chainHeight = useAhmLatestHeight();

  const { value: spendsEntries, loading } = useCall(
    api?.query?.[treasuryPallet]?.spends?.entries,
    [],
  );

  const { expiringSoonCount, validSoonCount } = useMemo(() => {
    if (!spendsEntries?.length || !blockTime || !chainHeight) {
      return { expiringSoonCount: 0, validSoonCount: 0 };
    }

    const now = Date.now();
    const sevenDaysLaterMs = now + SEVEN_DAYS_MS;
    const threeDaysLaterMs = now + THREE_DAYS_MS;

    let expiring = 0;
    let validating = 0;

    spendsEntries.forEach(([, spendOption]) => {
      if (!spendOption || spendOption.isNone) {
        return;
      }

      const spend = spendOption.unwrap();
      const validFrom = spend.validFrom?.toNumber?.();
      const expireAt = spend.expireAt?.toNumber?.();

      if (expireAt && expireAt > chainHeight) {
        const heightDiff = expireAt - chainHeight;
        const timeLeftMs = BigNumber(heightDiff)
          .multipliedBy(blockTime)
          .toNumber();
        const expireTimeMs = now + timeLeftMs;

        if (expireTimeMs > now && expireTimeMs <= sevenDaysLaterMs) {
          expiring++;
        }
      }

      if (validFrom && validFrom > chainHeight) {
        const heightDiff = validFrom - chainHeight;
        const timeLeftMs = BigNumber(heightDiff)
          .multipliedBy(blockTime)
          .toNumber();
        const validTimeMs = now + timeLeftMs;

        if (validTimeMs > now && validTimeMs <= threeDaysLaterMs) {
          validating++;
        }
      }
    });

    return {
      expiringSoonCount: expiring,
      validSoonCount: validating,
    };
  }, [spendsEntries, blockTime, chainHeight]);

  return {
    expiringSoonCount,
    validSoonCount,
    loading,
  };
}
