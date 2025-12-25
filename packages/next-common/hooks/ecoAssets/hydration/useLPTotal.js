import { useMemo } from "react";
import useAccountPositions from "./common/useAccountPosition";
import useLiquidityPositionData from "./common/useLiquidityPositionData";
import BigNumber from "bignumber.js";

function useOmnipoolPositionsData(address) {
  const { data: accountPositions, isLoading } = useAccountPositions(address);
  const { liquidityPositions } = accountPositions ?? {};

  const positionIds = liquidityPositions?.map((position) => position.assetId);

  const { getData } = useLiquidityPositionData(positionIds);

  const data = useMemo(() => {
    return (liquidityPositions ?? []).reduce((acc, position) => {
      const data = getData(position);
      if (data) acc.push(data);
      return acc;
    }, []);
  }, [getData, liquidityPositions]);

  return {
    data,
    isLoading,
  };
}

export default function useLPTotal(address) {
  const { data, isLoading } = useOmnipoolPositionsData(address);

  const balance = useMemo(
    () =>
      data.reduce(
        (acc, { valueDisplay }) => BigNumber(acc).plus(valueDisplay).toString(),
        "0",
      ),
    [data],
  );

  return {
    balance,
    isLoading,
  };
}
