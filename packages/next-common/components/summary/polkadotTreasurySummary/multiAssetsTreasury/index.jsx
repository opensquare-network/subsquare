import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import TokenSymbolAssets from "../common/tokenSymbolAssets";
import {
  StatemintTreasuryAccount,
  StatemintAssets,
} from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import PolkadotTokenSymbol from "../common/polkadotTokenSymbol";
import { useAssetHubApi } from "next-common/context/assetHub";
import { useSubscribeFellowshipTreasuryFree } from "../common/useSubscribeAssetHubTreasuryFree";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { useSubscribeAssetHubAssets } from "../common/useSubscribeAssetHubAssets";

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
function TokenSymbolAssetsList() {
  const api = useAssetHubApi();
  SybmbolAssets.forEach((item) => {
    const { free: balance } = useSubscribeAssetHubAssets(
      api,
      item.id,
      StatemintTreasuryAccount,
    );
    item.balance = balance;
  });

  return SybmbolAssets.map((item) => {
    return (
      <TokenSymbolAssets
        type={item.type}
        amount={item?.balance || 0}
        symbol={item.symbol}
      />
    );
  });
}

export default function MultiAssetsTreasury() {
  const api = useAssetHubApi();
  const { free, isLoading } = useSubscribeFellowshipTreasuryFree(
    api,
    StatemintTreasuryAccount,
  );

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
          <TokenSymbolAssetsList />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
