import { toPrecision, toPrecisionNumber } from "next-common/utils";
import { abbreviateBigNumber } from "next-common/utils/viewfuncs";
import ValueDisplay from "next-common/components/valueDisplay";
import DailyStatChart from "./dailyStatChart";
import useHolderStats, { holderStatsDays } from "./useHolderStats";
import useIssuanceStats from "./useIssuanceStats";

// dotUSD is an Asset Hub asset with six decimals.
const DOT_USD_DECIMALS = 6;

export function DotUsdHolderStats() {
  const { items, isLoading } = useHolderStats();

  return (
    <DailyStatChart
      points={items}
      isLoading={isLoading}
      colorKey="purple500"
      valueOf={({ holderCount }) => holderCount}
      renderValue={({ holderCount }) => holderCount}
      formatTick={(value) => value}
      ticksPrecision={0}
      formatTooltip={(value) => `${value} accounts`}
      subtitle={`Accounts holding the asset · last ${holderStatsDays} days`}
      ariaLabel={`dotUSD holders of the last ${holderStatsDays} days`}
      emptyText="No holder data available."
    />
  );
}

export function DotUsdIssuanceStats() {
  const { items, isLoading } = useIssuanceStats();

  return (
    <DailyStatChart
      points={items}
      isLoading={isLoading}
      colorKey="green500"
      valueOf={({ totalIssuance }) =>
        toPrecisionNumber(totalIssuance, DOT_USD_DECIMALS)
      }
      renderValue={({ totalIssuance }) => (
        <ValueDisplay
          value={toPrecision(totalIssuance, DOT_USD_DECIMALS, 2)}
          symbol="dotUSD"
        />
      )}
      formatTick={(value) => abbreviateBigNumber(value, 2)}
      formatTooltip={(value) => `${abbreviateBigNumber(value, 2)} dotUSD`}
      subtitle="Total issued dotUSD · since launch"
      ariaLabel="dotUSD total issuance since launch"
      emptyText="No issuance data available."
    />
  );
}
