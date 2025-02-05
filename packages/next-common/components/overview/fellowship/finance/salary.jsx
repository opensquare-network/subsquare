import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import LoadableContent from "next-common/components/common/loadableContent";
import FiatPriceLabel from "next-common/components/summary/polkadotTreasurySummary/common/fiatPriceLabel";
import useQueryFellowshipSalaryBalance, {
  StatemintFellowShipSalaryAccount,
} from "next-common/context/treasury/polkadotTreasury/hooks/useQueryFellowshipSalaryBalance";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import TokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/tokenSymbolAsset";

export default function FellowshipSalary() {
  const { balance, isLoading } = useQueryFellowshipSalaryBalance("USDT");

  const Title = (
    <>
      <Link
        href={`https://assethub-polkadot.subscan.io/account/${StatemintFellowShipSalaryAccount}`}
        className="text12Medium text-textTertiary hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        Salary ↗
      </Link>
    </>
  );

  return (
    <SummaryItem title={Title}>
      <LoadableContent isLoading={isLoading}>
        <div className="flex flex-col gap-[4px]">
          <div>
            <FiatPriceLabel usdtBalance={balance} />
          </div>
          <div className="flex flex-col gap-y-1 !ml-0">
            <TokenSymbolAsset
              amount={toPrecision(balance, SYMBOL_DECIMALS.USDT)}
              symbol="USDT"
            />
          </div>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
