import SummaryItem from "next-common/components/summary/layout/item";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import LoadableContent from "next-common/components/common/loadableContent";
import { usePolkadotTreasurySummary } from "../context";
import { useEffect, useState } from "react";
import { isNil } from "lodash-es";

export default function TotalTreasury() {
  const {
    USDtBalance,
    USDCBalance,
    DOTBalance,
    relayChainFree,
    multiAssetsFree,
    fellowshipFree,
  } = usePolkadotTreasurySummary();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (
      isNil(USDtBalance) ||
      isNil(USDCBalance) ||
      isNil(DOTBalance) ||
      isNil(relayChainFree) ||
      isNil(multiAssetsFree) ||
      isNil(fellowshipFree)
    ) {
      return;
    }

    setIsLoading(false);
  }, [
    USDtBalance,
    USDCBalance,
    relayChainFree,
    multiAssetsFree,
    fellowshipFree,
    DOTBalance,
    setIsLoading,
  ]);

  return (
    <SummaryItem title="Total">
      <LoadableContent isLoading={isLoading}>
        <FiatPriceLabel
          free={DOTBalance}
          USDtBalance={USDtBalance}
          USDCBalance={USDCBalance}
        />
        <div className="!ml-0 flex flex-col gap-y-1">
          <DotTokenSymbolAsset free={DOTBalance} />
          <TokenSymbolAsset type={""} amount={USDCBalance} symbol={"USDC"} />
          <TokenSymbolAsset type={""} amount={USDtBalance} symbol={"USDt"} />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
