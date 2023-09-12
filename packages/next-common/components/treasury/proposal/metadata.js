import React from "react";
import KVList from "../../listInfo/kvList";
import capitalize from "../../../utils/capitalize";
import User from "../../user";
import SymbolBalance from "../../values/symbolBalance";

const keys = {
  proposer: "proposer",
  beneficiary: "beneficiary",
  value: "value",
  bond: "bond",
};

export default function TreasuryProposalMetadata({ treasuryProposal = {} }) {
  const meta = treasuryProposal?.meta || {};
  const metadata = Object.entries(meta);
  let proposer = meta.proposer;
  if (treasuryProposal.isByGov2 && treasuryProposal.proposer) {
    proposer = treasuryProposal.proposer;
  }

  const data = metadata.map(([key, value]) => {
    if (keys.proposer === key) {
      return [
        capitalize(key),
        <User add={proposer} fontSize={14} key="user" />,
      ];
    } else if ([keys.proposer, keys.beneficiary].includes(key)) {
      return [capitalize(key), <User add={value} fontSize={14} key="user" />];
    } else if ([keys.value, keys.bond].includes(key)) {
      return [capitalize(key), <SymbolBalance value={value} key="balance" />];
    } else {
      return [capitalize(key), value];
    }
  });

  return <KVList title="Metadata" data={data} showFold />;
}
