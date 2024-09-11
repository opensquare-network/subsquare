import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import TokenSymbolAssets from "../common/tokenSymbolAssets";

function TokenSymbolAssetsList() {
  // TODO: mock data
  const MockTokenSybmbolAssets = [
    {
      type: "native",
      amount: 123321,
      symbol: "DOT",
    },
    {
      type: "",
      amount: 123321,
      symbol: "USDC",
    },
    {
      type: "",
      amount: 123321,
      symbol: "USDt",
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

export default function TotalTreasury() {
  // TODO: address, totalBalance, amount1
  const address = "";
  const totalBalance = 123;
  const { symbol, decimals } = useChainSettings();
  const amount1 = 123321;

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
        <div className="!ml-0">
          <TokenSymbolAssetsList />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
