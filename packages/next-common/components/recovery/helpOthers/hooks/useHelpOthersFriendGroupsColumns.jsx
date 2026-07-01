"use client";

import { useMemo, useState } from "react";
import Tooltip from "next-common/components/tooltip";
import { friendGroupColumns } from "next-common/components/recovery/common/columns";
import InitiateAttemptDialog from "../initiateAttemptDialog";

function RecoverButton({ lostAccount, friendGroupIndex, onRecover, disabled }) {
  const [showDialog, setShowDialog] = useState(false);

  if (disabled) {
    return (
      <Tooltip content="Recovery attempt already exists">
        <span className="text14Medium text-textTertiary cursor-not-allowed">
          Recover
        </span>
      </Tooltip>
    );
  }

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
      <Tooltip content="Initiate a recovery attempt">
        <button
          type="button"
          className="text14Medium text-theme500 cursor-pointer"
          onClick={() => setShowDialog(true)}
        >
          Recover
        </button>
      </Tooltip>
    </>
  );
}

function HelpOthersFriendGroupActions({
  account,
  index,
  attemptsData,
  onRecover,
}) {
  const hasAttempt = attemptsData.some(
    (a) => a.lostAccount === account && a.friendGroupIndex === index,
  );

  return (
    <RecoverButton
      lostAccount={account}
      friendGroupIndex={index}
      onRecover={onRecover}
      disabled={hasAttempt}
    />
  );
}

export default function useHelpOthersFriendGroupsColumns(
  onRecover,
  attemptsData = [],
) {
  return useMemo(() => {
    const desktopColumns = [
      friendGroupColumns.account("min-w-[200px] text-left"),
      friendGroupColumns.groupIndex("w-[120px] text-left"),
      friendGroupColumns.priority("w-[100px] text-left"),
      friendGroupColumns.friends("w-[100px] text-left"),
      friendGroupColumns.threshold("w-[120px] text-left"),
      friendGroupColumns.inheritor("min-w-[160px] text-left"),
      friendGroupColumns.inheritanceDelay("w-[180px] text-left"),
      friendGroupColumns.cancelDelay("w-[160px] text-left"),
      {
        name: "Action",
        className: "w-[100px] text-right",
        render: (item) => (
          <HelpOthersFriendGroupActions
            account={item.account}
            index={item.index}
            attemptsData={attemptsData}
            onRecover={onRecover}
          />
        ),
      },
    ];

    const mobileColumns = [
      friendGroupColumns.account("text-left"),
      friendGroupColumns.groupIndex("text-right"),
      friendGroupColumns.priority("text-right"),
      friendGroupColumns.friends("text-left"),
      friendGroupColumns.threshold("text-right"),
      friendGroupColumns.inheritor("text-right"),
      friendGroupColumns.inheritanceDelay("text-right"),
      friendGroupColumns.cancelDelay("text-right"),
      {
        name: "Action",
        className: "text-left",
        render: (item) => (
          <HelpOthersFriendGroupActions
            account={item.account}
            index={item.index}
            attemptsData={attemptsData}
            onRecover={onRecover}
          />
        ),
      },
    ];

    return { desktopColumns, mobileColumns };
  }, [onRecover, attemptsData]);
}
