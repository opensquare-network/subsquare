import React from "react";
import KVList from "../listInfo/kvList";
import User from "../user";
import SymbolBalance from "../values/symbolBalance";
import Copyable from "../copyable";

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
    ["hash", <Copyable key="hash">{publicProposal?.hash}</Copyable>],
    ["deposit", <SymbolBalance value={getDeposit(deposit)} key="balance" />],
    [
      "proposer",
      <User add={publicProposal?.proposer} fontSize={14} key="user" />,
    ],
  ];

  return <KVList title="Metadata" data={metadata} showFold />;
}
