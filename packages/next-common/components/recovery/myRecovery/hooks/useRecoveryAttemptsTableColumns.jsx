"use client";

import { useMemo } from "react";
import { attemptColumns } from "next-common/components/recovery/common/columns";
import SlashButton from "../slashButton";
import CancelButton from "../cancelButton";

function AttemptActions({ lostAccount, friendGroupIndex, onSlash, onCancel }) {
  return (
    <div className="flex gap-2 justify-end">
      <CancelButton
        lostAccount={lostAccount}
        friendGroupIndex={friendGroupIndex}
        onCancel={onCancel}
      />
      <SlashButton friendGroupIndex={friendGroupIndex} onSlash={onSlash} />
    </div>
  );
}

export default function useRecoveryAttemptsTableColumns(onSlash, onCancel) {
  return useMemo(() => {
    const desktopColumns = [
      attemptColumns.groupIndex("w-[120px] text-left"),
      attemptColumns.initiator("min-w-[200px] text-left"),
      attemptColumns.initBlock("w-[180px] text-left"),
      attemptColumns.lastApprovalBlock("w-[200px] text-left"),
      attemptColumns.thresholdApprovals("w-[160px] text-left"),
      {
        name: "Action",
        className: "w-[160px] text-right",
        render: (item) => (
          <AttemptActions
            lostAccount={item.lostAccount}
            friendGroupIndex={item.friendGroupIndex}
            onSlash={onSlash}
            onCancel={onCancel}
          />
        ),
      },
    ];

    const mobileColumns = [
      attemptColumns.groupIndex("text-right"),
      attemptColumns.initiator("text-left"),
      attemptColumns.initBlock("text-right"),
      attemptColumns.lastApprovalBlock("text-right"),
      attemptColumns.thresholdApprovals("text-right"),
      {
        name: "Action",
        className: "text-right",
        render: (item) => (
          <AttemptActions
            lostAccount={item.lostAccount}
            friendGroupIndex={item.friendGroupIndex}
            onSlash={onSlash}
            onCancel={onCancel}
          />
        ),
      },
    ];

    return { desktopColumns, mobileColumns };
  }, [onSlash, onCancel]);
}
