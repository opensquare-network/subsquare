import React from "react";
import getTreasurySpendBusiness from "components/gov2/business/treasurySpend";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import Link from "next/link";
import { toPrecision } from "next-common/utils";
import AddressUser from "next-common/components/user/addressUser";
import { getTreasuryAllSpendsBusiness } from "components/gov2/business/treasuryAllSpends";

function extractReferendaLink(call = {}) {
  const { section, method, args = [] } = call;
  if ("referenda" !== section) {
    return null;
  }
  if (!["cancel"].includes(method)) {
    return null;
  }

  const referendumId = args[0].value;
  return [
    [
      "Link to",
      <Link
        key="referendum-link"
        href={`/referenda/${referendumId}`}
      >{`Referendum #${referendumId}`}</Link>,
    ],
  ];
}

function extractTreasury(call = {}) {
  const { section, method, args = [] } = call;
  if ("treasury" !== section) {
    return null;
  }

  if (["approveProposal", "rejectProposal"].includes(method)) {
    const proposalId = args[0].value;
    return [
      [
        "Link to",
        <Link
          key="proposal-link"
          href={`/treasury/proposals/${proposalId}`}
        >{`Treasury Proposal #${proposalId}`}</Link>,
      ],
    ];
  }

  return null;
}

function extractBounty(call = {}, chainSettings = {}) {
  const { section, method, args = [] } = call;
  if ("bounties" !== section) {
    return null;
  }

  if (["closeBounty", "approveBounty", "unassignCurator"].includes(method)) {
    const bountyId = args[0].value;
    return [
      [
        "Link to",
        <Link
          key="bounty-link"
          href={`/treasury/bounties/${bountyId}`}
        >{`Bounty #${bountyId}`}</Link>,
      ],
    ];
  }

  const { decimals, symbol } = chainSettings;
  if ("proposeCurator" === method) {
    const bountyId = args[0].value;
    let curator = args[1].value;
    if (typeof curator === "object" && curator.id) {
      curator = curator.id;
    }
    const fee = args[2].value;
    return [
      [
        "Link to",
        <Link
          key="bounty-link"
          href={`/treasury/bounties/${bountyId}`}
        >{`Bounty #${bountyId}`}</Link>,
      ],
      [
        "Curator",
        <AddressUser key="curator" add={curator} color="var(--sapphire500)" />,
      ],
      ["Fee", `${toPrecision(fee, decimals)} ${symbol}`],
    ];
  }

  return null;
}

export default function useReferendaBusinessData() {
  const { decimals, symbol } = useChainSettings();
  const onchain = useOnchainData();
  const chainSettings = useChainSettings();

  if (!onchain.proposal) {
    return null;
  }

  const allSpendsBusiness = getTreasuryAllSpendsBusiness(onchain);
  if (allSpendsBusiness) {
    return allSpendsBusiness;
  }

  const spendBusiness = getTreasurySpendBusiness(onchain, decimals, symbol);
  if (spendBusiness) {
    return spendBusiness;
  }

  const treasuryBusiness = extractTreasury(onchain.proposal?.call);
  if (treasuryBusiness) {
    return treasuryBusiness;
  }

  const bountyBusiness = extractBounty(onchain.proposal?.call, chainSettings);
  if (bountyBusiness) {
    return bountyBusiness;
  }

  const referendaBusiness = extractReferendaLink(onchain.proposal?.call);
  if (referendaBusiness) {
    return referendaBusiness;
  }

  return null;
}
