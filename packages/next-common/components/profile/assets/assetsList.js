import React from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";
import {
  formatBalance,
  TokenSymbol,
} from "next-common/components/assets/assetsList";

export default function ProfileAssetsList({ assets }) {
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
      name: "Frozen",
      style: { textAlign: "right", width: "160px", minWidth: "160px" },
    },
  ];

  const rows = (assets || []).map((item) => [
    <TokenSymbol key="token" type={item.type} assetId={item.assetId} symbol={item.symbol} />,
    <span key="name" className="text14Medium text-textTertiary">
      {item.name}
    </span>,
    <span key="balance" className="text14Medium text-textPrimary">
      {formatBalance(item.balance || 0, item.decimals)}
    </span>,
    item.isFrozen ? (
      <span key="frozen" className="text14Medium text-textPrimary">
        Frozen
      </span>
    ) : (
      <span key="frozen" className="text14Medium text-textTertiary">
        -
      </span>
    ),
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
