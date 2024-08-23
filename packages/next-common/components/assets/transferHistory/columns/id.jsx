import { isNil } from "lodash-es";

export function useAssetsTransfersHistoryIdColumn() {
  return {
    name: "ID",
    style: { textAlign: "left", width: "120px", minWidth: "120px" },
    render: (item) => (
      <span className="text14Medium text-textTertiary">
        {isNil(item.assetId) ? "-" : `#${item.assetId}`}
      </span>
    ),
  };
}
