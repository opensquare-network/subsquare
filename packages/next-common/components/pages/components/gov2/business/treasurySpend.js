import { toPrecisionNumber } from "next-common/utils";
import React from "react";
import ValueDisplay from "next-common/components/valueDisplay";
import { isNil } from "lodash-es";
import Link from "next/link";
import AddressUser from "next-common/components/user/addressUser";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import BeneficiaryDetailButton from "./beneficiaryDetailButton";
import ValueDisplayWithFiatValue from "./valueDisplayVithFiatValue";

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

function getStableTreasuryBusiness(onchain) {
  const { proposal, stableTreasuryInfo } = onchain || {};
  const { spends = [] } = stableTreasuryInfo || {};
  const beneficiaryLocation = proposal?.call?.args?.find(
    (item) => item.name === "beneficiary",
  );

  const requests = (
    <div className="flex flex-col">
      {spends.map((spend, index) => (
        <div
          key={index}
          className="flex gap-[8px] items-center text14Medium text-textPrimary"
        >
          <ValueDisplay
            value={toPrecisionNumber(
              spend.amount,
              SYMBOL_DECIMALS[spend.symbol],
            )}
            symbol={spend.symbol}
          />
          <span className="text-textTertiary">to</span>
          {spend.beneficiary ? (
            <AddressUser add={spend.beneficiary} />
          ) : (
            <BeneficiaryDetailButton
              beneficiaryLocation={beneficiaryLocation}
            />
          )}
        </div>
      ))}
    </div>
  );
  return [["Request", requests]];
}

export default function getTreasurySpendBusiness(onchain, decimals, symbol) {
  const business = [];

  if (onchain.isTreasury) {
    business.push(...getTreasuryBusiness(onchain, decimals, symbol));
  } else if (onchain.isStableTreasury) {
    business.push(...getStableTreasuryBusiness(onchain));
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
