import React from "react";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";

export const colTotal = {
  name: "Total",
  style: { textAlign: "right", width: "140px" },
  render: (item) => (
    <ValueDisplay value={toPrecision(item.balance || 0, item.decimals)} />
  ),
};
