import { colId } from "./id";
import { colToken } from "./token";
import { colFrom } from "./from";
import { colTo } from "./to";
import { colAmount } from "./amount";
import { useAssetsTransfersHistoryTimeAgeColumn } from "next-common/components/assets/transferHistory/columns/timeAge";

export const useForeignAssetTransfersColumnsDef = () => {
  const timeAgeColumn = useAssetsTransfersHistoryTimeAgeColumn();
  return [
    colToken,
    colId,
    colFrom,
    colTo,
    timeAgeColumn,
    colAmount,
  ];
};
