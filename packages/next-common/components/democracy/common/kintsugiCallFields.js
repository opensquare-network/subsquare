import Chains from "next-common/utils/consts/chains";
import getChainSettings from "next-common/utils/consts/settings";
import { toPrecision } from "next-common/utils";
import User from "next-common/components/user";
import React from "react";

export default function extractKintsugiFields(chain, call = {}) {
  if (![Chains.kintsugi, Chains.interlay].includes(chain)) {
    return [];
  }

  const { section, method, args = [] } = call;
  if ("democracy" !== section || "spendFromTreasury" !== method) {
    return [];
  }
  const value = args[0].value;
  const beneficiary = args[1].value;

  const { decimals, symbol } = getChainSettings(chain);

  return [
    ["Request", `${toPrecision(value, decimals)} ${symbol}`],
    [
      "Beneficiary",
      <User
        key="beneficiary"
        add={beneficiary}
        showAvatar={true}
        color="var(--sapphire500)"
      />,
    ],
  ];
}
