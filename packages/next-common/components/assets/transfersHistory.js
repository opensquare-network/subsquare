import React, { useEffect } from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import { isNil } from "lodash-es";
import useAssetHubTransfersHistory from "next-common/utils/hooks/useAssetHubTransfersHistory";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { TokenSymbol } from "next-common/components/assets/assetsList";

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

export const colFrom = {
  name: "From",
  style: { textAlign: "left", minWidth: "256px" },
  render: (item) => <AddressUser key={item.from} add={item.from} />,
};

export const colTo = {
  name: "To",
  style: { textAlign: "left", minWidth: "256px" },
  render: (item) => <AddressUser key={item.to} add={item.to} />,
};

// TODO: Age / Time
export const colAge = {
  name: "Age",
  style: { textAlign: "left", width: "160px", minWidth: "160px" },
  render: (item) => (
    <span key="age" className="text14Medium text-textPrimary">
      Age / Time
    </span>
  ),
};

export const colAmount = {
  name: "Amount",
  style: { textAlign: "right", width: "160px", minWidth: "160px" },
  render: (item) => (
    <span key="amount" className="text14Medium text-textPrimary">
      <ValueDisplay
        value={toPrecision(item?.balance, item?.decimals)}
        symbol={item?.symbol}
        showNotEqualTooltip
      />
    </span>
  ),
};

const columnsDef = [colToken, colId, colFrom, colTo, colAge, colAmount];

export default function AssetsTransfersHistory({ setTotalCount }) {
  const { value: transfersHistoryList, loading } =
    useAssetHubTransfersHistory();

  useEffect(() => {
    console.log(":::::value, loading", transfersHistoryList, loading);
    if (transfersHistoryList) {
      setTotalCount(transfersHistoryList.items.length);
    }
  }, []);
  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columnsDef}
        data={transfersHistoryList.items}
        loading={loading}
        noDataText="No data"
      />
    </ScrollerX>
  );
}
