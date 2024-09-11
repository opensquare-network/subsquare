import { TokenSymbol } from "next-common/components/assets/assetsList";

export default function TokenSymbolAssets({ type, assetId, symbol }) {
  return <TokenSymbol key="token" type={type} assetId={assetId} symbol={symbol} />;
}
