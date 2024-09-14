import SummaryItem from "next-common/components/summary/layout/item";
import TokenSymbolAssets from "../common/tokenSymbolAssets";
import FiatPriceLabel from "../common/fiatPriceLabel";
import PolkadotTokenSymbol from "../common/polkadotTokenSymbol";
import LoadableContent from "next-common/components/common/loadableContent";

export default function TotalTreasury({ USDtBalance, USDCBalance, DOTBalance, isLoading }) {
  return (
    <SummaryItem title="Total Treasury">
      <LoadableContent isLoading={isLoading}>
        <FiatPriceLabel free={DOTBalance} USDtBalance={USDtBalance} USDCBalance={USDCBalance} />
      </LoadableContent>
      <div className="!ml-0">
        <LoadableContent isLoading={isLoading}>
          <PolkadotTokenSymbol free={DOTBalance} />
        </LoadableContent>
        <LoadableContent isLoading={isLoading}>
          <TokenSymbolAssets type={""} amount={USDCBalance} symbol={"USDC"} />
        </LoadableContent>
        <LoadableContent isLoading={isLoading}>
          <TokenSymbolAssets type={""} amount={USDtBalance} symbol={"USDt"} />
        </LoadableContent>
      </div>
    </SummaryItem>
  );
}