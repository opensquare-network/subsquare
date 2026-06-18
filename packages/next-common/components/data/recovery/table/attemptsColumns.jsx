import AddressUser from "next-common/components/user/addressUser";
import Tooltip from "next-common/components/tooltip";
import { AddressesTooltip } from "next-common/components/multisigs/fields";
import { useRelayChainApi } from "next-common/context/relayChain";
import { useChainSettings } from "next-common/context/chain";
import { estimateBlocksTime } from "next-common/utils";
import useCall from "next-common/utils/hooks/useCall";
import { isNil } from "lodash-es";

function BlockNumberWithTooltip({ height }) {
  const api = useRelayChainApi();
  const { blockTime } = useChainSettings();
  const { value: currentNumber } = useCall(api?.query?.system?.number, []);
  const currentHeight = currentNumber?.toNumber();

  if (isNil(height) || isNil(currentHeight)) {
    return (
      <span className="text14Medium text-textPrimary">
        #{height?.toLocaleString() || 0}
      </span>
    );
  }

  const diff = Math.max(0, currentHeight - height);
  const estimatedTime = diff > 0 ? estimateBlocksTime(diff, blockTime) : null;

  return (
    <Tooltip content={estimatedTime ? `${estimatedTime} ago` : ""}>
      <span className="text14Medium text-textPrimary">
        #{height?.toLocaleString() || 0}
      </span>
    </Tooltip>
  );
}

export const desktopColumns = [
  {
    name: "Lost Account",
    className: "min-w-[200px] text-left",
    render: (item) => (
      <AddressUser key="lostAccount" add={item.lostAccount} maxWidth={200} />
    ),
  },
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
    className: "w-[160px] text-right",
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
];

export const mobileColumns = [
  {
    name: "Lost Account",
    className: "text-left",
    render: (item) => <AddressUser add={item.lostAccount} maxWidth={160} />,
  },
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
];
