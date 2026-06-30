"use client";

import { useMemo, useState } from "react";
import AddressUser from "next-common/components/user/addressUser";
import Tooltip from "next-common/components/tooltip";
import { AddressesTooltip } from "next-common/components/multisigs/fields";
import DelayBlock from "next-common/components/recovery/delayBlock";
import { isNil } from "lodash-es";
import InitiateAttemptDialog from "../initiateAttemptDialog";

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

function RecoverButton({ lostAccount, friendGroupIndex, onRecover }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {showDialog && (
        <InitiateAttemptDialog
          onClose={() => setShowDialog(false)}
          lostAccount={lostAccount}
          friendGroupIndex={friendGroupIndex}
          onInBlock={onRecover}
        />
      )}
      <button
        type="button"
        className="text14Medium text-theme500 cursor-pointer"
        onClick={() => setShowDialog(true)}
      >
        Recover
      </button>
    </>
  );
}

export default function useHelpOthersFriendGroupsColumns(onRecover) {
  return useMemo(() => {
    const desktopColumns = [
      {
        name: "Account",
        className: "min-w-[200px] text-left",
        render: (item) => (
          <AddressUser key="account" add={item.account} maxWidth={200} />
        ),
      },
      {
        name: "Group Index",
        className: "w-[120px] text-left",
        render: (item) => (
          <span className="text14Medium text-textPrimary">#{item.index}</span>
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
        name: "Inheritor",
        className: "min-w-[160px] text-left",
        render: (item) => (
          <AddressUser key="inheritor" add={item.inheritor} maxWidth={160} />
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
      {
        name: "Action",
        className: "w-[100px] text-right",
        render: (item) => (
          <RecoverButton
            lostAccount={item.account}
            friendGroupIndex={item.index}
            onRecover={onRecover}
          />
        ),
      },
    ];

    const mobileColumns = [
      {
        name: "Account",
        className: "text-left",
        render: (item) => <AddressUser add={item.account} maxWidth={160} />,
      },
      {
        name: "Group Index",
        className: "text-right",
        render: (item) => (
          <span className="text14Medium text-textTertiary">#{item.index}</span>
        ),
      },
      {
        name: "Priority",
        className: "text-right",
        render: (item) => (
          <span className="text14Medium text-textTertiary">
            {item.inheritancePriority}
          </span>
        ),
      },
      {
        name: "Friends",
        className: "text-left",
        render: (item) => <FriendsCount friends={item.friends} />,
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
        name: "Inheritor",
        className: "text-right",
        render: (item) => <AddressUser add={item.inheritor} maxWidth={120} />,
      },
      {
        name: "Inheritance Delay",
        className: "text-right",
        render: (item) => <DelayBlock blocks={item.inheritanceDelay} />,
      },
      {
        name: "Cancel Delay",
        className: "text-right",
        render: (item) => <DelayBlock blocks={item.cancelDelay} />,
      },
      {
        name: "Action",
        className: "text-left",
        render: (item) => (
          <RecoverButton
            lostAccount={item.account}
            friendGroupIndex={item.index}
            onRecover={onRecover}
          />
        ),
      },
    ];

    return { desktopColumns, mobileColumns };
  }, [onRecover]);
}
