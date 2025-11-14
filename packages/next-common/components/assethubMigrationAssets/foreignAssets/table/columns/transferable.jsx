import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";

export const colTransferable = {
  name: "Transferable",
  style: { textAlign: "right", width: "160px" },
  render: (item) => (
    <ValueDisplay
      key={item.assetId}
      value={toPrecision(item.transferable, item.decimals)}
    />
  ),
};
