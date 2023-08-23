import { toPrecision } from "next-common/utils";
import User from "next-common/components/user";
import React from "react";
import ValueDisplay from "next-common/components/valueDisplay";
import isNil from "lodash.isnil";
import Link from "next/link";

export default function getTreasurySpendBusiness(onchain, decimals, symbol) {
  const { amount, beneficiary } = onchain?.treasuryInfo || {};

  const business = [];
  if (amount) {
    business.push([
      "Request",
      <ValueDisplay
        key="request"
        value={toPrecision(amount, decimals)}
        symbol={symbol}
      />,
    ]);
  }
  if (beneficiary) {
    business.push([
      "Beneficiary",
      <User key="beneficiary" add={beneficiary} fontSize={14} />,
    ]);
  }

  if (!isNil(onchain.treasuryProposalIndex)) {
    business.push([
      "Link to",
      <Link
        key="proposal-link"
        href={`/treasury/proposals/${onchain.treasuryProposalIndex}`}
        legacyBehavior
      >{`Treasury Proposal #${onchain.treasuryProposalIndex}`}</Link>,
    ]);
  }

  if (business.length <= 0) {
    return null;
  }

  return business;
}
