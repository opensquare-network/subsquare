import React, { useState } from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import {
  colId,
  colName,
  colToken,
} from "next-common/components/assets/common/columns";
import ValueDisplay from "next-common/components/valueDisplay";
import AddressUser from "next-common/components/user/addressUser";
import { toPrecision } from "next-common/utils";
import {
  SystemSignalFrozen,
  SystemSignalDestroying,
} from "@osn/icons/subsquare";
import SignalIndicator from "next-common/components/icons/signalIndicator";
import Tooltip from "next-common/components/tooltip";

export const colAccounts = {
  name: "Accounts",
  style: { textAlign: "right", width: "120px", minWidth: "120px" },
  render: (item) => (
    <span key="accounts" className="text14Medium text-textPrimary">
      {item.accounts.toLocaleString()}
    </span>
  ),
};

export const colStatus = {
  name: "",
  style: { textAlign: "right", width: "40px", minWidth: "40px" },
  render: (item) => (
    <div key="status" className="flex items-center">
      <Tooltip content={item.status}>
        {item.status === "Live" ? (
          <SignalIndicator className="w-[16px] h-[16px]" active={true} />
        ) : item.status === "Frozen" ? (
          <SystemSignalFrozen width={16} height={16} />
        ) : item.status === "Destroying" ? (
          <SystemSignalDestroying width={16} height={16} />
        ) : null}
      </Tooltip>
    </div>
  ),
};

export const colSupply = {
  name: "Supply",
  style: { textAlign: "right", width: "140px", minWidth: "140px" },
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
  const [showAllAdmin, setShowAllAdmin] = useState(false);

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
  const columnsDef = [
    colStatus,
    colToken,
    colId,
    colName,
    colInfo,
    colAccounts,
    colSupply,
  ];

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
