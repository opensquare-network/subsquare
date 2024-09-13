import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import TokenSymbolAssets from "../common/tokenSymbolAssets";
import useAssetHubTreasuryBalance, {
  StatemintTreasuryAccount,
  StatemintAssets,
} from "next-common/hooks/treasury/useAssetHubTreasuryBalance";

function TokenSymbolAssetsList() {
  const getAssetBySymbol = (symbol) =>
    StatemintAssets.find((asset) => asset.symbol === symbol);
  const asset = useAssetHubTreasuryBalance("USDC");
  console.log(":::::getAssetBySymbol, ", asset);
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

export default function MultiAssetsTreasury() {
  // TODO: totalBalance Link
  const totalBalance = 123;
  const { decimals } = useChainSettings();

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://statemint.statescan.io/#/accounts/${StatemintTreasuryAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">
            Multi Assets Treasury
          </span>
          <i className="text-textTertiary">↗</i>
        </Link>
      }
    >
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
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
