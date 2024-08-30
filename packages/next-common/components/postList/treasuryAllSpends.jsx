import BigNumber from "bignumber.js";
import { find, groupBy } from "lodash-es";
import { useChain } from "next-common/context/chain";
import { cn, toPrecision } from "next-common/utils";
import Chains from "next-common/utils/consts/chains";
import getChainSettings from "next-common/utils/consts/settings";
import knownPolkadotAssetHubAssets from "../assets/known/polkadot";
import ValueDisplay from "../valueDisplay";
import Tooltip from "../tooltip";

export default function PostListTreasuryAllSpends({ allSpends }) {
  const groupedSpends = groupBy(allSpends, "assetKind.symbol");
  const resolvedSpends = Object.keys(groupedSpends).map((symbol) => {
    const spends = groupedSpends[symbol];
    const amount = BigNumber.sum(
      ...spends.map((spend) => spend.amount),
    ).toString();

    return {
      symbol,
      amount,
      assetKind: spends[0].assetKind,
    };
  });

  if (resolvedSpends.length === 1) {
    const { amount, assetKind } = resolvedSpends[0];
    const { type, chain, symbol } = assetKind;

    return (
      <SingleSpend amount={amount} chain={chain} type={type} symbol={symbol} />
    );
  }

  return <MultiSpends spends={resolvedSpends} />;
}

function SingleSpend({ amount, chain, type, symbol }) {
  return (
    <div className="flex items-baseline">
      <div className="flex items-center gap-x-2">
        <SpendValueDisplay
          chain={chain}
          type={type}
          symbol={symbol}
          amount={amount}
        />

        <SpendAssetIcon symbol={symbol} />
      </div>
    </div>
  );
}

function MultiSpends({ spends }) {
  return (
    <Tooltip
      className="flex items-center"
      content={
        <div className="flex flex-col">
          {spends.map((spend) => (
            <SpendValueDisplay
              key={spend.symbol}
              className="text-textPrimaryContrast text12Medium"
              showTooltip={false}
              amount={spend.amount}
              type={spend.assetKind.type}
              chain={spend.assetKind.chain}
              symbol={spend.symbol}
            />
          ))}
        </div>
      }
    >
      {spends.map((spend, idx) => (
        <SpendAssetIcon
          key={spend.symbol}
          symbol={spend.symbol}
          className={cn(idx > 0 && "-ml-2")}
        />
      ))}
    </Tooltip>
  );
}

function SpendValueDisplay({
  chain,
  type,
  symbol,
  amount,
  className = "",
  showTooltip,
}) {
  const currentChain = useChain();

  if (type === "assets") {
    chain = Chains.polkadotAssetHub;
  } else if (type === "native") {
    chain = currentChain;
  }
  const { decimals } = getChainSettings(chain);

  return (
    <ValueDisplay
      className={cn("text14Medium", className)}
      value={toPrecision(amount, decimals)}
      symbol={symbol}
      showTooltip={showTooltip}
    />
  );
}

function SpendAssetIcon({ symbol, className = "" }) {
  const foundAsset = find(knownPolkadotAssetHubAssets, { symbol });
  return foundAsset?.icon && <foundAsset.icon className={className} />;
}
