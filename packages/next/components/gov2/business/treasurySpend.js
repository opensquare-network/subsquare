import ValueDisplay from "next-common/components/displayValue";
import { toPrecision } from "next-common/utils";
import User from "next-common/components/user";
import React from "react";

export default function getTreasurySpendBusiness(call = {}, decimals, symbol) {
  const { section, method, args = [] } = call;
  if ("treasury" !== section && "spend" !== method) {
    return null;
  }

  const business = [[]];
  const valueArg = args.find(({ name }) => "amount" === name);
  if (valueArg) {
    business[0].push([
      "Request",
      <ValueDisplay
        key="request"
        value={toPrecision(valueArg.value, decimals)}
        symbol={symbol}
      />,
    ]);
  }
  const beneficiaryArg = args.find(({ name }) => "beneficiary" === name);
  if (beneficiaryArg) {
    business[0].push([
      "Beneficiary",
      <User
        key="beneficiary"
        add={beneficiaryArg.value.id || beneficiaryArg.value}
        fontSize={14}
      />,
    ]);
  }

  if (business[0].length <= 0) {
    return null;
  }

  return business;
}
