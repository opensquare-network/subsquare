import { AssetIconPlaceholder } from "@osn/icons/subsquare";
import useKnownAssetHubAssetIcon, {
  useNativeTokenIcon,
} from "next-common/components/assets/known";
import BalanceDisplay from "next-common/components/assets/balanceDisplay";
import { isNil } from "lodash-es";
import useSubAssetBalance from "next-common/components/assets/useSubAssetBalance";
import { formatBalance } from "./index";

export function TokenSymbol({ type, assetId, symbol }) {
  const NativeAssetIcon = useNativeTokenIcon();
  const Icon = useKnownAssetHubAssetIcon(assetId);
  let AssetIcon = NativeAssetIcon;
  if (type !== "native") {
    AssetIcon = Icon || AssetIconPlaceholder;
  }

  return (
    <div className="flex gap-[8px] items-center text14Medium text-textPrimary">
      <AssetIcon width={24} height={24} /> {symbol}
    </div>
  );
}

export const colToken = {
  name: "Token",
  style: { textAlign: "left", width: "160px", minWidth: "160px" },
  render: (item) => (
    <TokenSymbol
      key="token"
      type={item.type}
      assetId={item.assetId}
      symbol={item.symbol}
    />
  ),
};

export const colId = {
  name: "ID",
  style: { textAlign: "left", width: "120px", minWidth: "120px" },
  render: (item) => (
    <span className="text14Medium text-textTertiary">
      {isNil(item.assetId) ? "-" : `#${item.assetId}`}
    </span>
  ),
};

export const colName = {
  name: "Name",
  style: { textAlign: "left", minWidth: "256px" },
  render: (item) => (
    <div
      key="name"
      className="text14Medium text-textTertiary truncate max-w-[240px]"
    >
      {item.name}
    </div>
  ),
};

function TotalBalance({ item, address }) {
  const { result } = useSubAssetBalance(item.assetId, address);

  // TODO: update balance & transferrable after transfer all current asset balance.
  return (
    <span className="text14Medium text-textPrimary">
      <BalanceDisplay
        balance={formatBalance(result?.balance || 0, item.decimals)}
      />
    </span>
  );
}

function TransferrableBalance({ item, address }) {
  const { result } = useSubAssetBalance(item.assetId, address);

  return (
    <span key="transferrable" className="text14Medium text-textPrimary">
      <BalanceDisplay
        balance={formatBalance(result?.transferrable || 0, item.decimals)}
      />
    </span>
  );
}

export function useColTotal(address) {
  return {
    name: "Total",
    style: { textAlign: "right", width: "160px", minWidth: "160px" },
    render: (item) => (
      <TotalBalance key="total" item={item} address={address} />
    ),
  };
}

export function useColTransferrable(address) {
  return {
    name: "Transferrable",
    style: { textAlign: "right", width: "160px", minWidth: "160px" },
    render: (item) => <TransferrableBalance item={item} address={address} />,
  };
}

export const colTotal = {
  name: "Total",
  style: { textAlign: "right", width: "160px", minWidth: "160px" },
  render: (item) => (
    <span key="total" className="text14Medium text-textPrimary">
      <BalanceDisplay
        balance={formatBalance(item.balance || 0, item.decimals)}
      />
    </span>
  ),
};

export const colTransferrable = {
  name: "Transferrable",
  style: { textAlign: "right", width: "160px", minWidth: "160px" },
  render: (item) => (
    <span key="transferrable" className="text14Medium text-textPrimary">
      <BalanceDisplay
        balance={formatBalance(item.transferrable || 0, item.decimals)}
      />
    </span>
  ),
};
