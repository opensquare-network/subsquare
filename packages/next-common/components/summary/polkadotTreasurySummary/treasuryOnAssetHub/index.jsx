import LoadableContent from "next-common/components/common/loadableContent";
import Link from "next/link";
import { usePolkadotTreasurySummary } from "../context";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import SummaryItem from "next-common/components/summary/layout/item";
import { StatemintTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { StatemintFellowShipTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import BigNumber from "bignumber.js";

function TreasurySummary({ multiAssetsFree, USDtBalance, USDCBalance }) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-[4px] text12Medium text-textPrimary">
        <Link
          className="text12Medium"
          href={`https://assethub-polkadot.subscan.io/account/${StatemintTreasuryAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">Treasury</span>
          <i className="text-textTertiary">&nbsp;↗</i>
        </Link>
        <FiatPriceLabel
          free={multiAssetsFree}
          USDCBalance={USDCBalance}
          USDtBalance={USDtBalance}
        />
      </div>
      <div className="!ml-0 flex flex-col gap-y-1">
        <DotTokenSymbolAsset free={multiAssetsFree} />
        <TokenSymbolAsset amount={USDCBalance} symbol="USDC" />
        <TokenSymbolAsset amount={USDtBalance} symbol="USDt" />
      </div>
    </div>
  );
}

function FellowshipSummary({ fellowshipFree }) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-[4px] text12Medium text-textPrimary">
        <Link
          className="text12Medium"
          href={`https://assethub-polkadot.subscan.io/account/${StatemintFellowShipTreasuryAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">Fellowship</span>
          <i className="text-textTertiary">&nbsp;↗</i>
        </Link>
        <FiatPriceLabel free={fellowshipFree} />
      </div>
      <div className="!ml-0">
        <DotTokenSymbolAsset free={fellowshipFree} />
      </div>
    </div>
  );
}

export default function TreasuryOnAssetHub() {
  const {
    multiAssetsFree,
    USDtBalance,
    USDCBalance,
    isMultiAssetsLoading,
    fellowshipFree,
    isFellowshipLoading,
  } = usePolkadotTreasurySummary();

  return (
    <SummaryItem title="Asset Hub">
      <LoadableContent isLoading={isMultiAssetsLoading || isFellowshipLoading}>
        <div className="flex flex-col gap-[16px]">
          <FiatPriceLabel
            free={new BigNumber(fellowshipFree)
              .plus(multiAssetsFree)
              .toString()}
            USDtBalance={USDtBalance}
            USDCBalance={USDCBalance}
          />
          <TreasurySummary
            multiAssetsFree={multiAssetsFree}
            USDtBalance={USDtBalance}
            USDCBalance={USDCBalance}
          />
          <FellowshipSummary fellowshipFree={fellowshipFree} />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
