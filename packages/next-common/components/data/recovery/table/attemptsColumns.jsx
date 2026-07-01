import { attemptColumns } from "next-common/components/recovery/common/columns";

export const desktopColumns = [
  attemptColumns.lostAccount("min-w-[200px] text-left"),
  attemptColumns.groupIndex("w-[120px] text-left"),
  attemptColumns.initiator("min-w-[200px] text-left"),
  attemptColumns.initBlock("w-[180px] text-left"),
  attemptColumns.lastApprovalBlock("w-[200px] text-left"),
  attemptColumns.thresholdApprovals("w-[160px] text-right"),
];

export const mobileColumns = [
  attemptColumns.lostAccount("text-left"),
  attemptColumns.groupIndex("text-right"),
  attemptColumns.initiator("text-left"),
  attemptColumns.initBlock("text-right"),
  attemptColumns.lastApprovalBlock("text-right"),
  attemptColumns.thresholdApprovals("text-right"),
];
