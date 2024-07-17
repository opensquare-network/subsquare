import React, { useState } from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import {
  colId,
  colName,
  colToken,
  formatBalance,
  paddingDecimals,
} from "../assetsList";
import BalanceDisplay from "../balanceDisplay";
import AddressUser from "next-common/components/user/addressUser";

const colSupply = {
  name: "Supply",
  style: { textAlign: "right", width: "240px", minWidth: "240px" },
  render: (item) => (
    <span key="total" className="text14Medium text-textPrimary">
      <BalanceDisplay
        balance={paddingDecimals(
          formatBalance(item.supply || 0, item.decimals),
          4,
        )}
      />
    </span>
  ),
};

function InfoAddressItem({ name, address }) {
  return (
    <div className="flex">
      <span className="text14Medium text-textTertiary min-w-[80px]">
        {name}
      </span>
      <AddressUser add={address} maxWidth={160} />
    </div>
  );
}

function useInfoCol() {
  const [isBriefInfo, setIsBriefInfo] = useState(true);

  return {
    name: (
      <div
        className="cursor-pointer text14Medium text-theme500"
        onClick={() => setIsBriefInfo(!isBriefInfo)}
      >
        {isBriefInfo ? "Brief info" : "Info"}
      </div>
    ),
    style: { textAlign: "left", width: "240px", minWidth: "240px" },
    render: (item) => (
      <div key="info" className="flex flex-col">
        <InfoAddressItem name="Admin" address={item.admin} />
        {isBriefInfo && (
          <>
            <InfoAddressItem name="Owner" address={item.owner} />
            <InfoAddressItem name="Issuer" address={item.issuer} />
          </>
        )}
      </div>
    ),
  };
}

export default function AssetsList({ assets }) {
  const colInfo = useInfoCol();
  const columnsDef = [colToken, colId, colName, colInfo, colSupply];

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
