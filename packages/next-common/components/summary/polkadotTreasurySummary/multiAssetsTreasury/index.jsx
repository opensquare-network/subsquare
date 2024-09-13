import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import TokenSymbolAssets from "../common/tokenSymbolAssets";
import { StatemintTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import PolkadotTokenSymbol from "../common/polkadotTokenSymbol";
import { useAssetHubApi } from "next-common/context/assetHub";
import { useSubscribeFellowshipTreasuryFree } from "../common/useSubscribeAssetHubTreasuryFree";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { useSubscribeAssetHubAssets } from "../common/useSubscribeAssetHubAssets";
import { useEffect } from "react";

const SybmbolAssets = [
  {
    id: 1984,
    symbol: "USDt",
    decimals: 6,
    type: "",
  },
  {
    id: 1337,
    symbol: "USDC",
    decimals: 6,
    type: "",
  },
];

function TokenSymbolAssetsList({ setUSDtFree, setUSDCFree }) {
  const usdtBalance = useSubscribeAssetHubAssets(1984, StatemintTreasuryAccount);
  const usdcBalance = useSubscribeAssetHubAssets(1337, StatemintTreasuryAccount);

  useEffect(() => {
    setUSDtFree(usdtBalance.free);
    setUSDCFree(usdcBalance.free);
  }, [usdtBalance.free, usdcBalance.free, setUSDtFree, setUSDCFree]);

  return SybmbolAssets.map((item) => {
    const balance = item.symbol === "USDt" ? usdtBalance.free : usdcBalance.free;
    return (
      <TokenSymbolAssets
        type={item.type}
        amount={balance || 0}
        symbol={item.symbol}
        key={item.symbol}
      />
    );
  });
}

export default function MultiAssetsTreasury({
  setMultiAssetsFree,
  setUSDtFree,
  setUSDCFree,
}) {
  const { free, isLoading } = useSubscribeFellowshipTreasuryFree(
    StatemintTreasuryAccount,
  );

  useEffect(() => {
    setMultiAssetsFree(free);
  }, [setMultiAssetsFree]);

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
          <FiatPriceLabel free={free} />
        </div>
        <div className="!ml-0">
          <PolkadotTokenSymbol free={free} />
          <TokenSymbolAssetsList
            setUSDtFree={setUSDtFree}
            setUSDCFree={setUSDCFree}
          />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
