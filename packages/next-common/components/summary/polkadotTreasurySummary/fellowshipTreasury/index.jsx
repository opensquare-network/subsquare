import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import Link from "next/link";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import TokenSymbolAssets from "../common/tokenSymbolAssets";
import { StatemintFellowShipTreasuryAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance"

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

export default function FellowshipTreasury() {
  // TODO: totalBalance Link
  const totalBalance = 9921999999999999999999;
  const { decimals } = useChainSettings();

  return (
    <SummaryItem
      title={
        <Link
          className="text12Medium"
          href={`https://statemint.statescan.io/#/accounts/${StatemintFellowShipTreasuryAccount}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className="text-textTertiary hover:underline">
            Fellowship Treasury
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
