import { useEffect, useState } from "react";
import useCall from "next-common/utils/hooks/useCall";
import { useContextApi } from "next-common/context/api";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";

function getUnlockableData(latestHeight, startingBlock, perBlock, locked) {
  if (isNil(latestHeight) || startingBlock > latestHeight) {
    return { unlockableBalance: 0, unlockablePercentage: 0 };
  }

  const unlockableBalance = (latestHeight - startingBlock) * perBlock;

  const unlockablePercentage = Number(
    (unlockableBalance / (locked + unlockableBalance)) * 100,
  ).toFixed(2);

  return { unlockableBalance, unlockablePercentage };
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
        const { startingBlock, perBlock, locked } = value?.toJSON()?.[0] || {};
        const { unlockableBalance, unlockablePercentage } = getUnlockableData(
          latestHeight,
          startingBlock,
          perBlock,
          locked,
        );

        return {
          address: storageKey?.args[0]?.toString(),
          startingBlock,
          perBlock,
          locked,
          unlockableBalance,
          unlockablePercentage,
        };
      })
      .sort((a, b) => b.unlockablePercentage - a.unlockablePercentage)
      .sort((a, b) => a.startingBlock - b.startingBlock);

    setData(results);
    setIsLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, loaded]);

  return {
    data,
    isLoading,
  };
}
