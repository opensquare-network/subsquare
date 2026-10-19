import { formatPermillPercent } from "../../utils";

export const colLpFee = {
  name: "LP fee",
  style: { textAlign: "left", width: "100px", minWidth: "100px" },
  render: (item) => (
    <span className="text14Medium text-textPrimary">
      {formatPermillPercent(item.lpFee) ?? "-"}
    </span>
  ),
};
