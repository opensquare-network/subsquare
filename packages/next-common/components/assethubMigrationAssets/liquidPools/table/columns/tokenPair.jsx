import { AssetIconPlaceholder } from "@osn/icons/subsquare";
import useKnownAssetHubAssetIcon, {
  useKnownForeignAssetIcon,
  useNativeTokenIcon,
} from "next-common/components/assethubMigrationAssets/known";

export function useTokenIcon(token) {
  const nativeTokenIcon = useNativeTokenIcon();
  const knownAssetIcon = useKnownAssetHubAssetIcon(token?.assetId);
  const knownForeignAssetIcon = useKnownForeignAssetIcon(token?.assetId);

  if (!token) {
    return null;
  }

  if (token.type === "native") {
    return nativeTokenIcon;
  }

  if (token.type === "foreign") {
    return knownForeignAssetIcon;
  }

  return knownAssetIcon || AssetIconPlaceholder;
}

function TokenLogo({ token }) {
  const Icon = useTokenIcon(token);
  return (
    <div className="p-[2px] rounded-full bg-neutral100 border border-neutral300">
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Icon width={24} height={24} />
    </div>
  );
}

function TokenPair({ token1, token2 }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex shrink-0 items-center">
        <TokenLogo token={token1} />
        <div className="-ml-2">
          <TokenLogo token={token2} />
        </div>
      </div>
      <span className="text14Medium text-textPrimary">
        {token1.symbol}/{token2.symbol}
      </span>
    </div>
  );
}

export const colTokenPair = {
  name: "Token Pair",
  style: { textAlign: "left", minWidth: "200px", width: "200px" },
  render: (item) => <TokenPair token1={item.token1} token2={item.token2} />,
};
