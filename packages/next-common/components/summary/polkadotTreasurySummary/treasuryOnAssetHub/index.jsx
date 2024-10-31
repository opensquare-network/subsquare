import LoadableContent from "next-common/components/common/loadableContent";
import Link from "next/link";
import { usePolkadotTreasurySummary } from "../context";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import SummaryItem from "next-common/components/summary/layout/item";
import { StatemintTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

function TreasurySummary({ multiAssetsFree, USDtBalance, USDCBalance }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="!ml-0 flex flex-col gap-y-1">
        <DotTokenSymbolAsset free={multiAssetsFree} />
        <TokenSymbolAsset
          amount={toPrecision(USDCBalance, SYMBOL_DECIMALS.USDC)}
          symbol="USDC"
        />
        <TokenSymbolAsset
          amount={toPrecision(USDtBalance, SYMBOL_DECIMALS.USDT)}
          symbol="USDt"
        />
      </div>
    </div>
  );
}

export default function TreasuryOnAssetHub() {
  const { multiAssetsFree, USDtBalance, USDCBalance, isMultiAssetsLoading } =
    usePolkadotTreasurySummary();

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://assethub-polkadot.subscan.io/account/${StatemintTreasuryAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">
            Asset Hub Treasury
          </span>
          <i className="text-textTertiary">&nbsp;↗</i>
        </Link>
      }
    >
      <LoadableContent isLoading={isMultiAssetsLoading}>
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel
            free={multiAssetsFree}
            USDtBalance={USDtBalance}
            USDCBalance={USDCBalance}
          />
          <TreasurySummary
            multiAssetsFree={multiAssetsFree}
            USDtBalance={USDtBalance}
            USDCBalance={USDCBalance}
          />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
