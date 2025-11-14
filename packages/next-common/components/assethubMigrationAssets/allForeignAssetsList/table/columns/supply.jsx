import React from "react";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export const colSupply = {
  name: "Supply",
  style: { textAlign: "right", width: "140px", minWidth: "140px" },
  render: (item) => (
    <span key="supply" className="text14Medium text-textPrimary">
      <ValueDisplay value={toPrecision(item.supply || 0, item.decimals)} />
    </span>
  ),
};
