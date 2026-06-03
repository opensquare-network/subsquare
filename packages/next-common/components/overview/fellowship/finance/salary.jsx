import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import FiatPriceLabel from "next-common/components/summary/polkadotTreasurySummary/common/fiatPriceLabel";
import useQueryFellowshipSalaryBalance, {
  StatemintFellowShipSalaryAccount,
} from "next-common/context/treasury/polkadotTreasury/hooks/useQueryFellowshipSalaryBalance";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import TokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/tokenSymbolAsset";
import { HOLLAR_DECIMALS, useFetchHollarBalance, ExternalLink } from "./common";

export default function FellowshipSalary() {
  const { balance: usdtBalance, isLoading: usdtLoading } =
    useQueryFellowshipSalaryBalance("USDT");
  const { balance: hollarBalance, loading: hollarLoading } =
    useFetchHollarBalance(StatemintFellowShipSalaryAccount);

  const Title = (
    <ExternalLink
      href={`https://assethub-polkadot.statescan.io/#/accounts/${StatemintFellowShipSalaryAccount}`}
    >
      Salary ↗
    </ExternalLink>
  );

  return (
    <SummaryItem title={Title}>
      <LoadableContent isLoading={usdtLoading && hollarLoading}>
        <div className="flex flex-col gap-[4px]">
          <div>
            <FiatPriceLabel
              usdtBalance={usdtBalance}
              hollarBalance={hollarBalance}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <TokenSymbolAsset
              amount={toPrecision(usdtBalance, SYMBOL_DECIMALS.USDT)}
              symbol="USDT"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <TokenSymbolAsset
              amount={toPrecision(hollarBalance, HOLLAR_DECIMALS)}
              symbol="HOLLAR"
              type="foreign"
            />
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
