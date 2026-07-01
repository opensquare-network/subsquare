"use client";

import { useMemo } from "react";
import { attemptColumns } from "next-common/components/recovery/common/columns";
import SlashButton from "../slashButton";

function AttemptActions({ friendGroupIndex, onSlash }) {
  return <SlashButton friendGroupIndex={friendGroupIndex} onSlash={onSlash} />;
}

export default function useRecoveryAttemptsTableColumns(onSlash) {
  return useMemo(() => {
    const desktopColumns = [
      attemptColumns.groupIndex("w-[120px] text-left"),
      attemptColumns.initiator("min-w-[200px] text-left"),
      attemptColumns.initBlock("w-[180px] text-left"),
      attemptColumns.lastApprovalBlock("w-[200px] text-left"),
      attemptColumns.thresholdApprovals("w-[160px] text-left"),
      {
        name: "Action",
        className: "w-[100px] text-right",
        render: (item) => (
          <AttemptActions
            friendGroupIndex={item.friendGroupIndex}
            onSlash={onSlash}
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
        className: "text-left",
        render: (item) => (
          <AttemptActions
            friendGroupIndex={item.friendGroupIndex}
            onSlash={onSlash}
          />
        ),
      },
    ];

    return { desktopColumns, mobileColumns };
  }, [onSlash]);
}
