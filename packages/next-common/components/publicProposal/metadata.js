import React from "react";
import KVList from "../listInfo/kvList";
import SymbolBalance from "../values/symbolBalance";
import Copyable from "../copyable";
import AddressUser from "../user/addressUser";

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
    ["deposit", <SymbolBalance isVote value={getDeposit(deposit)} key="balance" />],
    ["proposer", <AddressUser add={publicProposal?.proposer} key="user" />],
  ];

  return <KVList title="Metadata" data={metadata} showFold />;
}
