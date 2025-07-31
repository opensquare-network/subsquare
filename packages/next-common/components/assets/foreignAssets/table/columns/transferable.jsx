import React from "react";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";

export const colTransferable = {
  name: "Transferable",
  style: { textAlign: "right", minWidth: "140px" },
  render: (item) => (
    <ValueDisplay value={toPrecision(item.transferable || 0, item.decimals)} />
  ),
};