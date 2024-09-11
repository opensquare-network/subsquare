import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import TokenSymbolAssets from "../common/tokenSymbolAssets";

export default function TotalTreasury() {
  // TODO: address, totalBalance
  const address = "";
  const totalBalance = 123;
  const { symbol, decimals } = useChainSettings();

  return (
    <SummaryItem title="Total Treasury">
      {/* TODO: loading */}
      <LoadableContent isLoading={false}>
        <div>
          <ValueDisplay
            key="value"
            value={toPrecision(totalBalance, decimals)}
            symbol={""}
          />
        </div>
        <div>
          {/* TODO: props */}
          {/* <TokenSymbolAssets type={"native"} assetId={1} symbol={symbol} /> */}
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
