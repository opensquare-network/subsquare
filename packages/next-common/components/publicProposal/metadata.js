import React from "react";
import Proposal from "../proposal";
import KVList from "../listInfo/kvList";
import User from "../user";
import SymbolBalance from "../values/symbolBalance";

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

export default function Metadata({ publicProposal }) {
  if (!publicProposal) {
    return null;
  }

  const deposit = publicProposal.deposit;
  const metadata = [
    ["hash", publicProposal?.hash],
    ["deposit", <SymbolBalance value={getDeposit(deposit)} key="balance" />],
    [
      "proposer",
      <User add={publicProposal?.proposer} fontSize={14} key="user" />,
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
      />,
    ]);
  }

  return <KVList title="Metadata" data={metadata} showFold />;
}
