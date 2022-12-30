import { toPrecision } from "next-common/utils";
import User from "next-common/components/user";
import React from "react";
import ValueDisplay from "next-common/components/valueDisplay";
import isNil from "lodash.isnil";
import Link from "next/link";

export default function getTreasurySpendBusiness(
  onchain,
  call = {},
  decimals,
  symbol
) {
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

  if (!isNil(onchain.treasuryProposalIndex)) {
    business[0].push([
      "Link to",
      <Link
        key="proposal-link"
        href={`/treasury/proposal/${onchain.treasuryProposalIndex}`}
      >{`Treasury Proposal #${onchain.treasuryProposalIndex}`}</Link>,
    ]);
  }

  if (business[0].length <= 0) {
    return null;
  }

  return business;
}
