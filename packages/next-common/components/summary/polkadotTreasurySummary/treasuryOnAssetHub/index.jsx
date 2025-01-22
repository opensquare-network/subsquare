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

function TreasurySummary({
  dotTreasuryBalanceOnAssetHub,
  usdtTreasuryBalanceOnAssetHub,
  usdcTreasuryBalanceOnAssetHub,
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="!ml-0 flex flex-col gap-y-1">
        <DotTokenSymbolAsset free={dotTreasuryBalanceOnAssetHub} />
        <TokenSymbolAsset
          amount={toPrecision(
            usdcTreasuryBalanceOnAssetHub,
            SYMBOL_DECIMALS.USDC,
          )}
          symbol="USDC"
        />
        <TokenSymbolAsset
          amount={toPrecision(
            usdtTreasuryBalanceOnAssetHub,
            SYMBOL_DECIMALS.USDT,
          )}
          symbol="USDT"
        />
      </div>
    </div>
  );
}

export default function TreasuryOnAssetHub() {
  const {
    dotTreasuryBalanceOnAssetHub,
    isDotTreasuryBalanceOnAssetHubLoading,
    usdtTreasuryBalanceOnAssetHub,
    isUsdtTreasuryBalanceOnAssetHubLoading,
    usdcTreasuryBalanceOnAssetHub,
    isUsdcTreasuryBalanceOnAssetHubLoading,
  } = usePolkadotTreasurySummary();

  const isLoading =
    isDotTreasuryBalanceOnAssetHubLoading ||
    isUsdtTreasuryBalanceOnAssetHubLoading ||
    isUsdcTreasuryBalanceOnAssetHubLoading;

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
      <LoadableContent isLoading={isLoading}>
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel
            free={dotTreasuryBalanceOnAssetHub}
            usdtBalance={usdtTreasuryBalanceOnAssetHub}
            usdcBalance={usdcTreasuryBalanceOnAssetHub}
          />
          <TreasurySummary
            dotTreasuryBalanceOnAssetHub={dotTreasuryBalanceOnAssetHub}
            usdtTreasuryBalanceOnAssetHub={usdtTreasuryBalanceOnAssetHub}
            usdcTreasuryBalanceOnAssetHub={usdcTreasuryBalanceOnAssetHub}
          />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
