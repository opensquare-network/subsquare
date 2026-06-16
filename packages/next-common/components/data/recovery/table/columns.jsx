import AddressUser from "next-common/components/user/addressUser";
import Tooltip from "next-common/components/tooltip";
import { AddressesTooltip } from "next-common/components/multisigs/fields";
import { estimateTimeFromBlocks } from "next-common/utils/viewfuncs/estimateTimeFromBlocks";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";

function FriendsCount({ friends = [] }) {
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

function DelayBlock({ blocks }) {
  const { blockTime } = useChainSettings();

  if (isNil(blocks)) {
    return null;
  }

  return (
    <Tooltip
      content={`${blocks} blocks ≈ ${estimateTimeFromBlocks(
        blocks,
        blockTime,
      )}`}
    >
      <span className="text14Medium text-textPrimary">
        {blocks?.toLocaleString() || 0}
      </span>
    </Tooltip>
  );
}

export const desktopColumns = [
  {
    name: "Account",
    className: "min-w-[200px] text-left",
    render: (item) => (
      <AddressUser key="account" add={item.account} maxWidth={200} />
    ),
  },
  {
    name: "Index",
    className: "w-[80px] text-left",
    render: (item) => (
      <span className="text14Medium text-textPrimary">{item.index}</span>
    ),
  },
  {
    name: "Priority",
    className: "w-[100px] text-left",
    render: (item) => (
      <span className="text14Medium text-textPrimary">
        {item.inheritancePriority}
      </span>
    ),
  },
  {
    name: "Friends",
    className: "w-[100px] text-left",
    render: (item) => <FriendsCount friends={item.friends} />,
  },
  {
    name: "Threshold",
    className: "w-[120px] text-left",
    render: (item) => (
      <span className="text14Medium text-textPrimary">
        {item.friendsNeeded}
      </span>
    ),
  },
  {
    name: "Inheritance Delay",
    className: "w-[180px] text-left",
    render: (item) => <DelayBlock blocks={item.inheritanceDelay} />,
  },
  {
    name: "Cancel Delay",
    className: "w-[160px] text-left",
    render: (item) => <DelayBlock blocks={item.cancelDelay} />,
  },
];

export const mobileColumns = [
  {
    name: "Account",
    className: "text-left",
    render: (item) => (
      <>
        <AddressUser add={item.account} maxWidth={160} />
        <FriendsCount friends={item.friends} />
      </>
    ),
  },
  {
    name: "Priority / Index",
    className: "text-right",
    render: (item) => (
      <span className="text14Medium text-textTertiary">
        P{item.inheritancePriority} / I{item.index}
      </span>
    ),
  },
  {
    name: "Threshold",
    className: "text-right",
    render: (item) => (
      <span className="text14Medium text-textPrimary">
        {item.friendsNeeded}
      </span>
    ),
  },
  {
    name: "Inheritance Delay",
    className: "text-right",
    render: (item) => <DelayBlock blocks={item.inheritanceDelay} />,
  },
];
