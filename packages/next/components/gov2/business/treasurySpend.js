import { toPrecision } from "next-common/utils";
import React from "react";
import ValueDisplay from "next-common/components/valueDisplay";
import { isNil } from "lodash-es";
import Link from "next/link";
import AddressUser from "next-common/components/user/addressUser";

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
              <AddressUser add={beneficiary} />
            </li>
          );
        })}
      </ol>,
    ]);
  } else if (beneficiary) {
    business.push([
      "Beneficiary",
      <AddressUser key="beneficiary" add={beneficiary} />,
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
