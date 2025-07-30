import React from "react";
// import { TokenSymbol } from "next-common/components/assets/assetsList";
// import BalanceDisplay from "next-common/components/assets/balanceDisplay";
import { isNil } from "lodash-es";
import { addressEllipsis } from "next-common/utils";
import useForeignAssetIcon from "next-common/components/assets/known";

// TODOS: Columns

function Token({ assetId }) {
  const icon = useForeignAssetIcon(assetId);
  return (
    <div className="flex items-center">
      <div className="mr-2">{icon}</div>
      {/* <TokenSymbol assetId={assetId} /> */}
    </div>
  );
}

// TODO: link to statescan?
export const colId = {
  name: "ID",
  style: { textAlign: "left", width: "120px", minWidth: "120px" },
  render: (item) => (
    <span className="text14Medium text-textTertiary">
      {isNil(item.assetId) ? "-" : `${addressEllipsis(item.assetId)}`}
    </span>
  ),
};


export const colToken = {
  name: "Token",
  style: { textAlign: "left", width: "160px", minWidth: "160px" },
  render: (item) => <Token assetId={item.assetId} />,
};

export const colLocation = {
  name: "Location",
  style: { textAlign: "right", width: "160px", minWidth: "160px" },
  render: () => "Location",
};

export const colTotal = {
  name: "Total",
  style: { textAlign: "right", width: "160px", minWidth: "160px" },
  render: () => "Total",
};

export const colTransferrable = {
  name: "Transferrable",
  style: { textAlign: "right", width: "160px", minWidth: "160px" },
  render: () => "Transferrable",
};

export const foreignAssetsColumnsDef = [
  colId,
  colToken,
  colLocation,
  colTotal,
  colTransferrable,
];
