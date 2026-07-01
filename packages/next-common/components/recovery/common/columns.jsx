"use client";

import AddressUser from "next-common/components/user/addressUser";
import Tooltip from "next-common/components/tooltip";
import { AddressesTooltip } from "next-common/components/multisigs/fields";
import BlockNumberWithTooltip from "next-common/components/recovery/myRecovery/blockNumberWithTooltip";
import DelayBlock from "next-common/components/recovery/delayBlock";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";

//
// Shared components
//

export function FriendsCount({ friends = [] }) {
  if (isNil(friends)) {
    return null;
  }

  return (
    <Tooltip
      content={<AddressesTooltip addresses={friends} addressMaxWidth={160} />}
    >
      <span className="text14Medium text-textPrimary">
        {friends?.length || 0}
      </span>
    </Tooltip>
  );
}

function TicketCellInner({ ticket }) {
  const { decimals, symbol } = useChainSettings();
  if (isNil(ticket)) {
    return null;
  }
  return <ValueDisplay value={toPrecision(ticket, decimals)} symbol={symbol} />;
}

//
// Attempt table columns
//

export const attemptColumns = {
  lostAccount: (className) => ({
    name: "Lost Account",
    className,
    render: (item) => (
      <AddressUser key="lostAccount" add={item.lostAccount} maxWidth={200} />
    ),
  }),

  groupIndex: (className) => ({
    name: "Group Index",
    className,
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
  }),

  initiator: (className) => ({
    name: "Initiator",
    className,
    render: (item) => (
      <AddressUser key="initiator" add={item.initiator} maxWidth={200} />
    ),
  }),

  initBlock: (className) => ({
    name: "Init Block",
    className,
    render: (item) => <BlockNumberWithTooltip height={item.initBlock} />,
  }),

  lastApprovalBlock: (className) => ({
    name: "Last Approval Block",
    className,
    render: (item) => (
      <BlockNumberWithTooltip height={item.lastApprovalBlock} />
    ),
  }),

  thresholdApprovals: (className) => ({
    name: "Threshold / Approvals",
    className,
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
  }),
};

//
// Friend group table columns
//

export const friendGroupColumns = {
  account: (className) => ({
    name: "Lost Account",
    className,
    render: (item) => (
      <AddressUser key="account" add={item.account} maxWidth={200} />
    ),
  }),

  groupIndex: (className) => ({
    name: "Group Index",
    className,
    render: (item) => (
      <span className="text14Medium text-textPrimary">#{item.index}</span>
    ),
  }),

  priority: (className) => ({
    name: "Priority",
    className,
    render: (item) => (
      <span className="text14Medium text-textPrimary">
        {item.inheritancePriority}
      </span>
    ),
  }),

  friends: (className) => ({
    name: "Friends",
    className,
    render: (item) => <FriendsCount friends={item.friends} />,
  }),

  threshold: (className) => ({
    name: "Threshold",
    className,
    render: (item) => (
      <span className="text14Medium text-textPrimary">
        {item.friendsNeeded}
      </span>
    ),
  }),

  inheritor: (className) => ({
    name: "Inheritor",
    className,
    render: (item) => (
      <AddressUser key="inheritor" add={item.inheritor} maxWidth={200} />
    ),
  }),

  inheritanceDelay: (className) => ({
    name: "Inheritance Delay",
    className,
    render: (item) => <DelayBlock blocks={item.inheritanceDelay} />,
  }),

  cancelDelay: (className) => ({
    name: "Cancel Delay",
    className,
    render: (item) => <DelayBlock blocks={item.cancelDelay} />,
  }),
};

//
// Inheritor table columns
//

export const inheritorColumns = {
  lostAccount: (className) => ({
    name: "Lost Account",
    className,
    render: (item) => (
      <AddressUser key="account" add={item.account} maxWidth={200} />
    ),
  }),

  inheritor: (className) => ({
    name: "Inheritor",
    className,
    render: (item) => (
      <AddressUser key="inheritor" add={item.inheritor} maxWidth={200} />
    ),
  }),

  priority: (className) => ({
    name: "Priority",
    className,
    render: (item) => (
      <span className="text14Medium text-textPrimary">
        {item.inheritancePriority}
      </span>
    ),
  }),

  depositor: (className) => ({
    name: "Depositor",
    className,
    render: (item) => (
      <AddressUser key="depositor" add={item.depositor} maxWidth={200} />
    ),
  }),

  deposit: (className) => ({
    name: "Deposit",
    className,
    render: (item) => <TicketCellInner ticket={item.ticket} />,
  }),
};
