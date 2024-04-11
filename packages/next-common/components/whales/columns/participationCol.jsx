import { toPercentage } from "next-common/utils";
import Tooltip from "../../tooltip";

export const participationCol = {
  name: "Participation",
  width: 120,
  className: "text-right",
  cellRender(data) {
    return (
      <Tooltip content={"Participation/Total: "} className="hover:underline">
        {toPercentage(data.participationRate, 1).toFixed(1)}%
      </Tooltip>
    );
  },
};
