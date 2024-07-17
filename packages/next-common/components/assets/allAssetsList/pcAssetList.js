import React, { useState } from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import { colId, colName, colToken } from "../assetsList";
import ValueDisplay from "next-common/components/valueDisplay";
import AddressUser from "next-common/components/user/addressUser";
import { toPrecision } from "next-common/utils";

export const colSupply = {
  name: "Supply",
  style: { textAlign: "right", width: "240px", minWidth: "240px" },
  render: (item) => (
    <span key="total" className="text14Medium text-textPrimary">
      <ValueDisplay value={toPrecision(item.supply || 0, item.decimals)} />
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
  const [showAllAdmin, setShowAllAdmin] = useState(true);

  return {
    name: (
      <div
        className="cursor-pointer text14Medium text-theme500"
        onClick={() => setShowAllAdmin(!showAllAdmin)}
      >
        {showAllAdmin ? "All admins" : "Admin"}
      </div>
    ),
    style: { textAlign: "left", width: "240px", minWidth: "240px" },
    render: (item) => (
      <div key="info" className="flex flex-col">
        {showAllAdmin ? (
          <>
            <InfoAddressItem name="Admin" address={item.admin} />
            <InfoAddressItem name="Owner" address={item.owner} />
            <InfoAddressItem name="Issuer" address={item.issuer} />
            <InfoAddressItem name="Freezer" address={item.freezer} />
          </>
        ) : (
          <AddressUser add={item.admin} maxWidth={160} />
        )}
      </div>
    ),
  };
}

export default function PCAssetsList({ assets }) {
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
