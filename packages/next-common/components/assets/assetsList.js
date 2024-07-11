import React, { useState } from "react";
import { AssetIconPlaceholder, SystemTransfer } from "@osn/icons/subsquare";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import BigNumber from "bignumber.js";
import ListButton from "next-common/components/styled/listButton";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import useKnownAssetHubAssetIcon, {
  useNativeTokenIcon,
} from "next-common/components/assets/known";
import BalanceDisplay from "./balanceDisplay";

const TransferPopup = dynamicClientOnly(() => import("./transferPopup"));

function TransferButton({ asset }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <ListButton
        onClick={() => {
          setShowPopup(true);
        }}
      >
        <SystemTransfer width={16} height={16} />
      </ListButton>
      {showPopup && (
        <TransferPopup asset={asset} onClose={() => setShowPopup(false)} />
      )}
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

export const colName = {
  name: "Name",
  style: { textAlign: "left", minWidth: "160px" },
  render: (item) => (
    <span key="name" className="text14Medium text-textTertiary">
      {item.name}
    </span>
  ),
};

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

export const colTransfer = {
  name: "",
  style: { textAlign: "right", width: "80px", minWidth: "80px" },
  render: (item) => <TransferButton asset={item} />,
};

const columnsDef = [colToken, colName, colTotal, colTransferrable, colTransfer];

export default function AssetsList({ assets }) {
  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columnsDef}
        data={assets}
        loading={!assets}
        noDataText="No current assets"
      />
    </ScrollerX>
  );
}
