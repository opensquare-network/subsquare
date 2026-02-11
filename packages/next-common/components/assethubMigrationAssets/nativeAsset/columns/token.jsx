import { useNativeTokenIcon } from "next-common/components/assethubMigrationAssets/known";

function TokenSymbol({ symbol }) {
  const NativeAssetIcon = useNativeTokenIcon();
  return (
    <div className="flex gap-[8px] items-center text14Medium text-textPrimary">
      {/* eslint-disable-next-line react-hooks/static-components */}
      <NativeAssetIcon width={24} height={24} /> {symbol}
    </div>
  );
}

export const colToken = {
  name: "Token",
  style: { textAlign: "left", minWidth: "160px" },
  render: (item) => <TokenSymbol key="token" symbol={item?.symbol} />,
};
