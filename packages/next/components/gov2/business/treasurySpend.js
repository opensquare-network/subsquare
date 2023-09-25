import { toPrecision } from "next-common/utils";
import User from "next-common/components/user";
import React from "react";
import ValueDisplay from "next-common/components/valueDisplay";
import isNil from "lodash.isnil";
import Link from "next/link";

export default function getTreasurySpendBusiness(onchain, decimals, symbol) {
  const {
    amount,
    beneficiary,
    beneficiaries = [],
  } = onchain?.treasuryInfo || {};

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

  if (beneficiaries.length > 1) {
    business.push([
      "Beneficiaries",
      <ol className="flex flex-wrap gap-x-4" key="beneficiaries">
        {beneficiaries.map((beneficiary, index) => {
          return (
            <li key={`beneficiary-${index}`}>
              <User add={beneficiary} fontSize={14} />
            </li>
          );
        })}
      </ol>,
    ]);
  } else if (beneficiary) {
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
