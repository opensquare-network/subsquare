import { colToken } from "next-common/components/assethubMigrationAssets/foreignAssets/table/columns/token";
import { colId } from "./id";
import { colStatus } from "./status";
import { colAccounts } from "./accounts";
import { colSupply } from "./supply";
import { useInfoCol, colAdmin, colIssuer, colOwner, colFreezer } from "./admin";

export const mobileColumns = [
  colToken,
  colId,
  colAdmin,
  colOwner,
  colIssuer,
  colFreezer,
  colAccounts,
  colSupply,
  colStatus,
];

export function useDesktopColumns() {
  const colInfo = useInfoCol();
  return [colStatus, colToken, colId, colInfo, colAccounts, colSupply];
}
