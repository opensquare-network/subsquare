import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import TokenSymbolAssets from "../common/tokenSymbolAssets";
import LabelItem from "../common/LabelItem";
import SpendPeriodItem from "./spendPeriodItem";

function TokenSymbolAssetsList() {
  // TODO: mock data
  const MockTokenSybmbolAssets = [
    {
      type: "native",
      amount: 123321,
      symbol: "DOT",
    },
  ];

  return MockTokenSybmbolAssets.map((item) => {
    return (
      <TokenSymbolAssets
        type={item.type}
        amount={item.amount}
        symbol={item.symbol}
      />
    );
  });
}

function LabelItems() {
  const { decimals } = useChainSettings();
  // TODO: mock data
  const balance1 = 12343545;
  const balance2 = 12343545;
  const symbol1 = "DOT";
  const symbol2 = "USDC";

  return (
    <>
      <LabelItem label={"To be awarded"}>
        <ValueDisplay
          value={toPrecision(balance1, decimals)}
          symbol={symbol1}
          className={"text12Medium text-textPrimary"}
          showApproximationSymbol={false}
        />
      </LabelItem>
      <LabelItem label={"Next burn"}>
        <ValueDisplay
          value={toPrecision(balance2, decimals)}
          symbol={symbol2}
          className={"text12Medium text-textPrimary"}
          showApproximationSymbol={false}
        />
      </LabelItem>
      <LabelItem label={"Spend period"}>
        <SpendPeriodItem
          percentage={12}
          label={"24d"}
          total={123}
          remain={12}
          text={"12d 12hrs"}
        />
      </LabelItem>
    </>
  );
}

export default function RelayChainTreasury() {
  // TODO: address, totalBalance
  const address = "";
  const totalBalance = 123456789;
  const { decimals } = useChainSettings();

  return (
    <SummaryItem title="Relay Chain Treasury">
      {/* TODO: loading */}
      <LoadableContent isLoading={false}>
        <div>
          <ValueDisplay
            key="value"
            value={toPrecision(totalBalance, decimals)}
            symbol={""}
            prefix={"$"}
          />
        </div>
        <div className="!ml-0">
          <TokenSymbolAssetsList />
          <LabelItems />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
