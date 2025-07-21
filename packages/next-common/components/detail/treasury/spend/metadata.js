import React from "react";
import AddressUser from "next-common/components/user/addressUser";
import KVList from "next-common/components/listInfo/kvList";
import HeightWithTime from "next-common/components/common/block/heightWithTime";
import useTreasurySpendRequest from "next-common/hooks/treasury/spend/useTreasurySpendRequest";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecisionNumber } from "next-common/utils";
import ExternalLink from "next-common/components/externalLink";
import BeneficiaryDetailButton from "next-common/components/pages/components/gov2/business/beneficiaryDetailButton";

function Beneficiary({ parachain, beneficiary, beneficiaryLocation }) {
  if (!beneficiary) {
    return (
      <BeneficiaryDetailButton beneficiaryLocation={beneficiaryLocation} />
    );
  }

  if (parachain !== "assethub") {
    return <AddressUser add={beneficiary} />;
  }

  let link = `https://assethub-polkadot.subscan.io/account/${beneficiary}`;
  return (
    <>
      <AddressUser add={beneficiary} />
      <ExternalLink href={link}>Check the beneficiary</ExternalLink>
    </>
  );
}

export default function TreasurySpendMetadata({ spend = {} }) {
  const meta = spend?.meta || {};
  const proposer = spend?.proposer;
  const { validFrom, expireAt } = meta;
  const {
    parachain,
    amount,
    symbol,
    decimals,
    beneficiary,
    beneficiaryLocation,
  } = useTreasurySpendRequest(spend?.extracted);

  const data = [["Id", `#${spend?.index}`]];
  if (proposer) {
    data.push(["Proposer", <AddressUser add={proposer} key="proposer" />]);
  }
  if (symbol) {
    data.push([
      "Request",
      <div
        key="request"
        className="flex flex-wrap gap-[8px] items-center text14Medium text-textPrimary"
      >
        <ValueDisplay
          value={toPrecisionNumber(amount, decimals)}
          symbol={symbol}
        />
        <span className="text-textTertiary">to</span>
        <Beneficiary
          parachain={parachain}
          beneficiary={beneficiary}
          beneficiaryLocation={beneficiaryLocation}
        />
      </div>,
    ]);
  }
  if (validFrom) {
    data.push([
      "Valid From",
      <HeightWithTime height={validFrom} key="valid-from" />,
    ]);
  }
  if (expireAt) {
    data.push([
      "Expire At",
      <HeightWithTime height={expireAt} key="expire-at" />,
    ]);
  }

  return <KVList title="Metadata" data={data} showFold />;
}
