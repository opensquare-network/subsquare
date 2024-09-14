import SummaryItem from "next-common/components/summary/layout/item";
import TokenSymbolAsset from "../common/tokenSymbolAsset";
import FiatPriceLabel from "../common/fiatPriceLabel";
import DotTokenSymbolAsset from "../common/dotTokenSymbolAsset";
import LoadableContent from "next-common/components/common/loadableContent";

export default function TotalTreasury({ USDtBalance, USDCBalance, DOTBalance, isLoading }) {
  return (
    <SummaryItem title="Total Treasury">
      <LoadableContent isLoading={isLoading}>
        <FiatPriceLabel free={DOTBalance} USDtBalance={USDtBalance} USDCBalance={USDCBalance} />
      </LoadableContent>
      <div className="!ml-0">
        <LoadableContent isLoading={isLoading}>
          <DotTokenSymbolAsset free={DOTBalance} />
        </LoadableContent>
        <LoadableContent isLoading={isLoading}>
          <TokenSymbolAsset type={""} amount={USDCBalance} symbol={"USDC"} />
        </LoadableContent>
        <LoadableContent isLoading={isLoading}>
          <TokenSymbolAsset type={""} amount={USDtBalance} symbol={"USDt"} />
        </LoadableContent>
      </div>
    </SummaryItem>
  );
}