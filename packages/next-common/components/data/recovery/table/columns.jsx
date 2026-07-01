import { friendGroupColumns } from "next-common/components/recovery/common/columns";

export const desktopColumns = [
  friendGroupColumns.account("min-w-[200px] text-left"),
  friendGroupColumns.groupIndex("w-[120px] text-left"),
  friendGroupColumns.priority("w-[100px] text-left"),
  friendGroupColumns.friends("w-[100px] text-left"),
  friendGroupColumns.threshold("w-[120px] text-left"),
  friendGroupColumns.inheritor("min-w-[160px] text-left"),
  friendGroupColumns.inheritanceDelay("w-[180px] text-left"),
  friendGroupColumns.cancelDelay("w-[160px] text-right"),
];

export const mobileColumns = [
  friendGroupColumns.account("text-left"),
  friendGroupColumns.groupIndex("text-right"),
  friendGroupColumns.priority("text-right"),
  friendGroupColumns.friends("text-left"),
  friendGroupColumns.threshold("text-right"),
  friendGroupColumns.inheritor("text-right"),
  friendGroupColumns.inheritanceDelay("text-right"),
  friendGroupColumns.cancelDelay("text-right"),
];
