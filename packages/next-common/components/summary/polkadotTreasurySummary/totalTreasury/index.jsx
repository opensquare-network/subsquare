import SummaryItem from "next-common/components/summary/layout/item";
import TokenSymbolAssets from "../common/tokenSymbolAssets";
import FiatPriceLabel from "../common/fiatPriceLabel";
import PolkadotTokenSymbol from "../common/polkadotTokenSymbol";

export default function TotalTreasury({ USDtFree, USDCFree, DOTFree }) {
  return (
    <SummaryItem title="Total Treasury">
      <FiatPriceLabel free={DOTFree} USDtFree={USDtFree} USDCFree={USDCFree} />
      <div className="!ml-0">
        <PolkadotTokenSymbol free={DOTFree} />
        <TokenSymbolAssets type={""} amount={USDCFree} symbol={"USDC"} />
        <TokenSymbolAssets type={""} amount={USDtFree} symbol={"USDt"} />
      </div>
    </SummaryItem>
  );
}
