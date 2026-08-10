import Tooltip from "next-common/components/tooltip";

export const colPoolId = {
  name: "Pool ID",
  style: { textAlign: "left", width: "90px", minWidth: "90px" },
  render: (item) => (
    <Tooltip content={`LP token ${item.poolAssetId}`}>
      <span className="text14Medium text-textTertiary">
        #{item.poolAssetId}
      </span>
    </Tooltip>
  ),
};
