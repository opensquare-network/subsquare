import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import { StatemintTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import { useSubscribeFellowshipTreasuryFree } from "../hook/useSubscribeAssetHubTreasuryFree";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { useSubscribeAssetHubAssets } from "../hook/useSubscribeAssetHubAssets";
import { useEffect } from "react";

const SybmbolAssets = [
  {
    id: 1337,
    symbol: "USDC",
    decimals: 6,
    type: "",
  },
  {
    id: 1984,
    symbol: "USDt",
    decimals: 6,
    type: "",
  },
];

export default function MultiAssetsTreasury({
  setMultiAssetsFree,
  setUSDtBalance,
  setUSDCBalance,
}) {
  const { free, isLoading } = useSubscribeFellowshipTreasuryFree(
    StatemintTreasuryAccount,
  );

  const usdtBalance = useSubscribeAssetHubAssets(
    1984,
    StatemintTreasuryAccount,
  );
  const usdcBalance = useSubscribeAssetHubAssets(
    1337,
    StatemintTreasuryAccount,
  );

  useEffect(() => {
    setUSDtBalance(usdtBalance.free);
    setUSDCBalance(usdcBalance.free);
  }, [usdtBalance.free, usdcBalance.free, setUSDtBalance, setUSDCBalance]);

  useEffect(() => {
    if (!free) return;

    setMultiAssetsFree(free);
  }, [free, setMultiAssetsFree]);

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://statemint.statescan.io/#/accounts/${StatemintTreasuryAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">
            Multi Assets Treasury
          </span>
          <i className="text-textTertiary">↗</i>
        </Link>
      }
    >
      <LoadableContent isLoading={isLoading}>
        <div>
          <FiatPriceLabel
            free={free}
            USDCBalance={usdcBalance.free}
            USDtBalance={usdtBalance.free}
          />
        </div>
        <div className="!ml-0">
          <DotTokenSymbolAsset free={free} />
          {SybmbolAssets.map((item) => {
            const balance =
              item.symbol === "USDt" ? usdtBalance.free : usdcBalance.free;
            return (
              <TokenSymbolAsset
                type={item.type}
                amount={balance || 0}
                symbol={item.symbol}
                key={item.symbol}
              />
            );
          })}
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
