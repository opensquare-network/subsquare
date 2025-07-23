import React from "react";
import { isNil } from "lodash-es";
import Link from "next/link";
import AddressUser from "next-common/components/user/addressUser";
import ValueDisplayWithFiatValue from "./valueDisplayWithFiatValue";

function getTreasuryBusiness(onchain, decimals, symbol) {
  const {
    amount,
    beneficiary,
    beneficiaries = [],
  } = onchain?.treasuryInfo || {};

  const business = [];
  if (amount) {
    business.push([
      "Request",
      <ValueDisplayWithFiatValue
        key="request"
        amount={amount}
        symbol={symbol}
        decimals={decimals}
        className="text14Medium"
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

  return business;
}

export default function getTreasurySpendBusiness(onchain, decimals, symbol) {
  const business = [];

  if (onchain.isTreasury) {
    business.push(...getTreasuryBusiness(onchain, decimals, symbol));
  }

  if (!isNil(onchain.treasuryProposalIndex)) {
    business.push([
      "Link to",
      <Link
        key="proposal-link"
        href={`/treasury/proposals/${onchain.treasuryProposalIndex}`}
      >{`Treasury Proposal #${onchain.treasuryProposalIndex}`}</Link>,
    ]);
  }

  if (business.length <= 0) {
    return null;
  }

  return business;
}
