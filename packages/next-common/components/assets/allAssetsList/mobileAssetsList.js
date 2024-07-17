import React from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import { colId, colName, colToken } from "../assetsList";
import { colSupply } from "./pcAssetList";
import AddressUser from "next-common/components/user/addressUser";

export const colAdmin = {
  name: "Admin",
  style: { textAlign: "left", minWidth: "160px" },
  render: (item) => <AddressUser key="admin" add={item.admin} />,
};

export const colIssuer = {
  name: "Issuer",
  style: { textAlign: "left", minWidth: "160px" },
  render: (item) => <AddressUser key="issuer" add={item.issuer} />,
};

export const colOwner = {
  name: "Owner",
  style: { textAlign: "left", minWidth: "160px" },
  render: (item) => <AddressUser key="owner" add={item.owner} />,
};

const columnsDef = [
  colToken,
  colId,
  colName,
  colAdmin,
  colOwner,
  colIssuer,
  colSupply,
];

export default function MobileAssetsList({ assets }) {
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
