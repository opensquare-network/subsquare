import LoadableContent from "next-common/components/common/loadableContent";
import { usePolkadotTreasurySummary } from "../context";
import FiatPriceLabel from "../common/fiatPriceLabel";
import SummaryItem from "next-common/components/summary/layout/item";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import { AmbassadorAccount } from "next-common/context/treasury/polkadotTreasury/hooks/useQueryAmbassadorBalance";
import Link from "next/link";
import TokenSymbolAsset from "../common/tokenSymbolAsset";

export default function Ambassador() {
  const { ambassadorUsdtBalance, isAmbassadorUsdtBalanceLoading } =
    usePolkadotTreasurySummary();

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://assethub-polkadot.subscan.io/account/${AmbassadorAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">Ambassador</span>
          <i className="text-textTertiary">&nbsp;↗</i>
        </Link>
      }
    >
      <LoadableContent isLoading={isAmbassadorUsdtBalanceLoading}>
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel usdtBalance={ambassadorUsdtBalance} />
          <TokenSymbolAsset
            amount={toPrecision(ambassadorUsdtBalance, SYMBOL_DECIMALS.USDT)}
            symbol="USDT"
          />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
