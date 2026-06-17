import AddressUser from "next-common/components/user/addressUser";
import Tooltip from "next-common/components/tooltip";
import { AddressesTooltip } from "next-common/components/multisigs/fields";
import { isNil } from "lodash-es";

function BlockNumber({ blocks }) {
  if (isNil(blocks)) {
    return null;
  }

  return (
    <span className="text14Medium text-textPrimary">
      #{blocks?.toLocaleString() || 0}
    </span>
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
      <span className="text14Medium text-textPrimary">
        #{item.friendGroupIndex}
      </span>
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
    render: (item) => <BlockNumber blocks={item.initBlock} />,
  },
  {
    name: "Last Approval Block",
    className: "w-[200px] text-left",
    render: (item) => <BlockNumber blocks={item.lastApprovalBlock} />,
  },
  {
    name: "Approvals",
    className: "w-[120px] text-left",
    render: (item) => (
      <Tooltip
        content={
          <AddressesTooltip
            addresses={item.approvedAddresses}
            addressMaxWidth={160}
          />
        }
      >
        <span className="text14Medium text-textPrimary cursor-pointer">
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
      <span className="text14Medium text-textPrimary cursor-pointer">
        #{item.friendGroupIndex}
      </span>
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
    render: (item) => <BlockNumber blocks={item.initBlock} />,
  },
  {
    name: "Last Approval Block",
    className: "w-[200px] text-left",
    render: (item) => <BlockNumber blocks={item.lastApprovalBlock} />,
  },
  {
    name: "Approvals",
    className: "text-right",
    render: (item) => (
      <Tooltip
        content={
          <AddressesTooltip
            addresses={item.approvedAddresses}
            addressMaxWidth={160}
          />
        }
      >
        <span className="text14Medium text-textPrimary">
          {item.approvalsCount}
        </span>
      </Tooltip>
    ),
  },
];
