import React, { useState } from "react";
import { SystemTransfer } from "@osn/icons/subsquare";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";
import BigNumber from "bignumber.js";
import ListButton from "next-common/components/styled/listButton";
import TransferPopup from "./transferPopup";

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

function TokenSymbol({ Icon, symbol }) {
  return (
    <div className="flex gap-[8px] items-center text14Medium text-textPrimary">
      <Icon width={24} height={24} /> {symbol}
    </div>
  );
}

function formatBalance(balance, decimals) {
  return new BigNumber(balance)
    .div(Math.pow(10, decimals))
    .toFormat({ decimalSeparator: ".", groupSeparator: ",", groupSize: 3 });
}

export default function AssetsList({ assets }) {
  const columns = [
    {
      name: "Token",
      style: { textAlign: "left", width: "160px", minWidth: "160px" },
    },
    {
      name: "Name",
      style: { textAlign: "left", minWidth: "160px" },
    },
    {
      name: "Balance",
      style: { textAlign: "right", width: "160px", minWidth: "160px" },
    },
    {
      name: "",
      style: { textAlign: "right", width: "80px", minWidth: "80px" },
    },
  ];

  const rows = (assets || []).map((item) => [
    <TokenSymbol key="token" Icon={item.icon} symbol={item.symbol} />,
    <span key="name" className="text14Medium text-textTertiary">
      {item.name}
    </span>,
    <span key="balance">
      {formatBalance(item.balance || 0, item.decimals)}
    </span>,
    <div key="transfer">
      <TransferButton asset={item} />
    </div>,
  ]);

  return (
    <ScrollerX>
      <DataList
        columns={columns}
        rows={rows}
        loading={!assets}
        noDataText="No current assets"
      />
    </ScrollerX>
  );
}
