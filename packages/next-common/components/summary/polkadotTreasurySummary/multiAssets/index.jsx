import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import TokenSymbolAssets from "../common/tokenSymbolAssets";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

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
  const address = "14xmwinmCEz6oRrFdczHKqHgWNMiCysE2KrA4jXXAAM1Eogk";
  const totalBalance = 123;
  const { decimals } = useChainSettings();

  if (!address) {
    return null;
  }

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://statemint.statescan.io/#/accounts/${address}`}
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
