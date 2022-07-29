import React from "react";
import Proposal from "../proposal";
import KVList from "../listInfo/kvList";
import { getNode, toPrecision } from "next-common/utils";
import UserWithLink from "../user/userWithLink";

function getDeposit(scanDepositData) {
  if (!Array.isArray(scanDepositData)) {
    return 0;
  }

  if (!Array.isArray(scanDepositData[0])) {
    return scanDepositData[0];
  } else {
    return scanDepositData[1];
  }
}

export default function Metadata({ publicProposal, chain }) {
  if (!publicProposal) {
    return null;
  }

  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.voteSymbol || node.symbol;

  const deposit = publicProposal.deposit;
  const metadata = [
    ["hash", publicProposal?.hash],
    ["deposit", `${toPrecision(getDeposit(deposit), decimals)} ${symbol}`],
    [
      "proposer",
      <UserWithLink chain={chain} address={publicProposal?.proposer} />,
    ],
  ];

  let call = publicProposal?.preImage?.call || publicProposal?.call;
  if (call) {
    metadata.push([
      <Proposal
        key={"index-proposal"}
        call={call}
        shorten={publicProposal.preImage?.shorten}
        proposalIndex={publicProposal.proposalIndex}
        referendumIndex={publicProposal.referendumIndex}
        chain={chain}
      />,
    ]);
  }

  return <KVList title="Metadata" data={metadata} showFold />;
}
