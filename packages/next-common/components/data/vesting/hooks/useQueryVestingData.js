import { useEffect, useState } from "react";
import useCall from "next-common/utils/hooks/useCall";
import { useContextApi } from "next-common/context/api";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import BigNumber from "bignumber.js";

function getUnlockableData(latestHeight, startingBlock, perBlock, locked) {
  if (isNil(latestHeight) || startingBlock > latestHeight) {
    return { unlockableBalance: "0", unlockablePercentage: "0.00" };
  }

  const bnLatestHeight = new BigNumber(latestHeight);
  const bnStartingBlock = new BigNumber(startingBlock);
  const bnPerBlock = new BigNumber(perBlock);
  const bnLocked = new BigNumber(locked);

  const unlockableBalance = BigNumber.max(
    0,
    BigNumber.min(
      bnLocked,
      bnLatestHeight.minus(bnStartingBlock).multipliedBy(bnPerBlock),
    ),
  );

  const unlockablePercentage = bnLocked.isZero()
    ? "0.00"
    : unlockableBalance.dividedBy(bnLocked).multipliedBy(100).toFixed(2);

  return {
    unlockableBalance: unlockableBalance.toString(),
    unlockablePercentage,
  };
}

export default function useQueryVestingData() {
  const api = useContextApi();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const latestHeight = useSelector(chainOrScanHeightSelector);

  const { value, loaded } = useCall(api?.query?.vesting?.vesting?.entries, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const results = (value || [])
      .map(([storageKey, value]) => {
        const address = storageKey?.args[0]?.toString();
        const { startingBlock, perBlock, locked } = value?.toJSON()?.[0] || {};
        const { unlockableBalance, unlockablePercentage } = getUnlockableData(
          latestHeight,
          startingBlock,
          perBlock,
          locked,
        );

        return {
          address,
          startingBlock,
          perBlock,
          locked,
          unlockableBalance,
          unlockablePercentage,
        };
      })
      .sort((a, b) => {
        const percA = new BigNumber(a.unlockablePercentage || "0.00");
        const percB = new BigNumber(b.unlockablePercentage || "0.00");
        const percCompare = percB.comparedTo(percA);

        if (percCompare !== 0) {
          return percCompare;
        }

        const startA = new BigNumber(a.startingBlock || "0");
        const startB = new BigNumber(b.startingBlock || "0");
        return startA.comparedTo(startB);
      });

    setData(results);
    setIsLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, loaded]);

  return {
    data,
    isLoading,
  };
}
