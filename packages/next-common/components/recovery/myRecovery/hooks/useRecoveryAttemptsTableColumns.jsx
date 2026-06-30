"use client";

import { useMemo } from "react";
import Tooltip from "next-common/components/tooltip";
import { AddressesTooltip } from "next-common/components/multisigs/fields";
import AddressUser from "next-common/components/user/addressUser";
import BlockNumberWithTooltip from "../blockNumberWithTooltip";
import SlashButton from "../slashButton";

export default function useRecoveryAttemptsTableColumns(onSlash) {
  return useMemo(() => {
    const desktopColumns = [
      {
        name: "Group Index",
        className: "w-[120px] text-left",
        render: (item) => (
          <Tooltip
            content={
              item.fgGroup && (
                <AddressesTooltip
                  addresses={item.fgGroup?.friends || []}
                  addressMaxWidth={160}
                />
              )
            }
          >
            <span className="text14Medium text-textPrimary">
              #{item.friendGroupIndex}
            </span>
          </Tooltip>
        ),
      },
      {
        name: "Initiator",
        className: "min-w-[200px] text-left",
        render: (item) => (
          <AddressUser key="initiator" add={item.initiator} maxWidth={200} />
        ),
      },
      {
        name: "Init Block",
        className: "w-[180px] text-left",
        render: (item) => <BlockNumberWithTooltip height={item.initBlock} />,
      },
      {
        name: "Last Approval Block",
        className: "w-[200px] text-left",
        render: (item) => (
          <BlockNumberWithTooltip height={item.lastApprovalBlock} />
        ),
      },
      {
        name: "Threshold / Approvals",
        className: "w-[160px] text-left",
        render: (item) => (
          <Tooltip
            content={
              item.approvedAddresses?.length > 0 && (
                <AddressesTooltip
                  addresses={item.approvedAddresses}
                  addressMaxWidth={160}
                />
              )
            }
          >
            <span className="text14Medium text-textPrimary">
              {item.fgGroup && (
                <span className="text-textTertiary">
                  {item.fgGroup?.friendsNeeded || 0} /{" "}
                </span>
              )}
              {item.approvalsCount}
            </span>
          </Tooltip>
        ),
      },
      {
        name: "Action",
        className: "w-[100px] text-right",
        render: (item) => (
          <SlashButton
            friendGroupIndex={item.friendGroupIndex}
            onSlash={onSlash}
          />
        ),
      },
    ];

    const mobileColumns = [
      {
        name: "Group Index",
        className: "text-right",
        render: (item) => (
          <Tooltip
            content={
              item.fgGroup && (
                <AddressesTooltip
                  addresses={item.fgGroup?.friends || []}
                  addressMaxWidth={160}
                />
              )
            }
          >
            <span className="text14Medium text-textPrimary cursor-pointer">
              #{item.friendGroupIndex}
            </span>
          </Tooltip>
        ),
      },
      {
        name: "Initiator",
        className: "text-left",
        render: (item) => <AddressUser add={item.initiator} maxWidth={120} />,
      },
      {
        name: "Init Block",
        className: "text-right",
        render: (item) => <BlockNumberWithTooltip height={item.initBlock} />,
      },
      {
        name: "Last Approval Block",
        className: "text-right",
        render: (item) => (
          <BlockNumberWithTooltip height={item.lastApprovalBlock} />
        ),
      },
      {
        name: "Threshold / Approvals",
        className: "text-right",
        render: (item) => (
          <Tooltip
            content={
              item.approvedAddresses?.length > 0 && (
                <AddressesTooltip
                  addresses={item.approvedAddresses}
                  addressMaxWidth={160}
                />
              )
            }
          >
            <span className="text14Medium text-textPrimary">
              {item.fgGroup && (
                <span className="text-textTertiary">
                  {item.fgGroup?.friendsNeeded || 0} /{" "}
                </span>
              )}
              {item.approvalsCount}
            </span>
          </Tooltip>
        ),
      },
      {
        name: "Action",
        className: "text-left",
        render: (item) => (
          <SlashButton
            friendGroupIndex={item.friendGroupIndex}
            onSlash={onSlash}
          />
        ),
      },
    ];

    return { desktopColumns, mobileColumns };
  }, [onSlash]);
}
