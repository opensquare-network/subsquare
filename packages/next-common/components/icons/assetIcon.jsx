import { find } from "lodash-es";
import knownPolkadotAssetHubAssets from "../assets/known/polkadot";

function transformSymbol(symbol) {
  return symbol === "USDT" ? "USDt" : symbol;
}

export default function AssetIcon({ symbol, className = "" }) {
  const foundAsset = find(knownPolkadotAssetHubAssets, {
    symbol: transformSymbol(symbol),
  });

  return foundAsset?.icon && <foundAsset.icon className={className} />;
}
