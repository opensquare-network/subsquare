import { useMemo } from "react";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import BigNumber from "bignumber.js";
import { estimateBlocksTime } from "next-common/utils";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";
import { useTreasuryPallet } from "next-common/context/treasury";
import { isNil } from "lodash-es";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

function getSpendIndex(storageKey) {
  return (
    storageKey?.args?.[0]?.toNumber?.() || storageKey?.args?.[0]?.toString?.()
  );
}

function isSpendCompleted(spend) {
  const state = spend?.state?.toString?.() || spend?.status?.toString?.();
  return ["Paid", "Processed"].includes(state);
}

function getSpendCountdown(spend, chainHeight) {
  if (isSpendCompleted(spend)) {
    return null;
  }

  const validFrom = spend.validFrom?.toNumber?.();
  const expireAt = spend.expireAt?.toNumber?.();

  if (isNil(validFrom) || isNil(expireAt)) {
    return null;
  }

  if (chainHeight < validFrom) {
    return {
      type: "valid",
      targetHeight: validFrom,
      blocks: validFrom - chainHeight,
    };
  }

  if (chainHeight < expireAt) {
    return {
      type: "expire",
      targetHeight: expireAt,
      blocks: expireAt - chainHeight,
    };
  }

  return null;
}

function getCountdownTimeLeftMs(countdown, blockTime) {
  return BigNumber(countdown.blocks).multipliedBy(blockTime).toNumber();
}

function getCountdownThresholdMs(type) {
  return type === "valid" ? THREE_DAYS_MS : SEVEN_DAYS_MS;
}

export default function usePendingSpends() {
  const api = useContextApi();
  const treasuryPallet = useTreasuryPallet();
  const blockTime = useSelector(blockTimeSelector);
  const chainHeight = useAhmLatestHeight();

  const { value: spendsEntries, loading } = useCall(
    api?.query?.[treasuryPallet]?.spends?.entries,
    [],
  );

  const { expiringSoonCount, validSoonCount, pendingSpendCountdowns } =
    useMemo(() => {
      if (!spendsEntries?.length || !blockTime || isNil(chainHeight)) {
        return {
          expiringSoonCount: 0,
          validSoonCount: 0,
          pendingSpendCountdowns: [],
        };
      }

      let expiring = 0;
      let validating = 0;
      const countdowns = [];

      spendsEntries.forEach(([storageKey, spendOption]) => {
        if (!spendOption || spendOption.isNone) {
          return;
        }

        const spend = spendOption.unwrap();
        const countdown = getSpendCountdown(spend, chainHeight);

        if (!countdown) {
          return;
        }

        const timeLeftMs = getCountdownTimeLeftMs(countdown, blockTime);

        if (timeLeftMs > getCountdownThresholdMs(countdown.type)) {
          return;
        }

        if (countdown.type === "expire") {
          expiring++;
        } else {
          validating++;
        }

        countdowns.push({
          index: getSpendIndex(storageKey),
          ...countdown,
          timeLeftMs,
          estimatedBlocksTime: estimateBlocksTime(countdown.blocks, blockTime),
        });
      });

      return {
        expiringSoonCount: expiring,
        validSoonCount: validating,
        pendingSpendCountdowns: countdowns.sort(
          (a, b) => a.timeLeftMs - b.timeLeftMs,
        ),
      };
    }, [spendsEntries, blockTime, chainHeight]);

  return {
    expiringSoonCount,
    validSoonCount,
    pendingSpendCountdowns,
    loading,
  };
}
