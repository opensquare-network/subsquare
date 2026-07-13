import { inheritorColumns } from "next-common/components/recovery/common/columns";

export const desktopColumns = [
  inheritorColumns.lostAccount("min-w-[200px] text-left"),
  inheritorColumns.inheritor("min-w-[200px] text-left"),
  inheritorColumns.priority("w-[120px] text-left"),
  inheritorColumns.depositor("min-w-[200px] text-left"),
  inheritorColumns.deposit("w-[180px] text-right"),
];

export const mobileColumns = [
  inheritorColumns.lostAccount("text-left"),
  inheritorColumns.inheritor("text-left"),
  inheritorColumns.priority("text-right"),
  inheritorColumns.depositor("text-left"),
  inheritorColumns.deposit("text-right"),
];
