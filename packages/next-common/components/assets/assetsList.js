import { useState } from "react";
import { AssetIconPlaceholder, SystemTransfer } from "@osn/icons/subsquare";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import BigNumber from "bignumber.js";
import ListButton from "next-common/components/styled/listButton";
import useKnownAssetHubAssetIcon, {
  useNativeTokenIcon,
} from "next-common/components/assets/known";
import BalanceDisplay from "./balanceDisplay";
import { isNil } from "lodash-es";
import Tooltip from "../tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useSubAssetBalance, {
  useQueryAddressAssets,
} from "next-common/components/assets/useSubAssetBalance";

const AssetTransferPopup = dynamicPopup(() => import("./transferPopup"));

function TransferButton({ asset }) {
  const [showPopup, setShowPopup] = useState(false);

  let popup = null;
  if (asset.type !== "native") {
    popup = (
      <AssetTransferPopup asset={asset} onClose={() => setShowPopup(false)} />
    );
  }

  return (
    <>
      <Tooltip content="Transfer">
        <ListButton
          onClick={() => {
            setShowPopup(true);
          }}
        >
          <SystemTransfer width={16} height={16} />
        </ListButton>
      </Tooltip>
      {showPopup && popup}
    </>
  );
}

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

export function formatBalance(balance, decimals) {
  return new BigNumber(balance)
    .div(Math.pow(10, decimals))
    .decimalPlaces(4, BigNumber.ROUND_FLOOR)
    .toFormat({ decimalSeparator: ".", groupSeparator: ",", groupSize: 3 });
}

export function paddingDecimals(value, decimals) {
  const [integerPart, fractionalPart = ""] = value.split(".");
  if (fractionalPart.length < decimals) {
    return `${integerPart}.${fractionalPart.padEnd(decimals, "0")}`;
  }
  return value;
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

  return (
    <span className="text14Medium text-textPrimary">
      <BalanceDisplay
        balance={formatBalance(
          result?.balance || item?.balance || 0,
          item.decimals,
        )}
      />
    </span>
  );
}

function TransferrableBalance({ item, address }) {
  const { result } = useSubAssetBalance(item.assetId, address);

  return (
    <span key="transferrable" className="text14Medium text-textPrimary">
      <BalanceDisplay
        balance={formatBalance(
          result?.transferrable || item.transferrable || 0,
          item.decimals,
        )}
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

// TODO: remove (profile page & native asset)
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

// TODO: remove (profile page & native asset)
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

export const colTransfer = {
  name: "",
  style: { textAlign: "right", width: "80px", minWidth: "80px" },
  render: (item) => <TransferButton asset={item} />,
};

export default function AssetsList({ address }) {
  const { loading, assets } = useQueryAddressAssets(address);
  const totalBalance = useColTotal(address);
  const transferrableBalance = useColTransferrable(address);

  const columnsDef = [
    colToken,
    colId,
    colName,
    totalBalance,
    transferrableBalance,
    colTransfer,
  ];

  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columnsDef}
        data={assets}
        loading={loading}
        noDataText="No current assets"
      />
    </ScrollerX>
  );
}
