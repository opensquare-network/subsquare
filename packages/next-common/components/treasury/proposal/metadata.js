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

export default function TreasuryProposalMetadata({ treasuryProposal }) {
  const metadata = Object.entries(treasuryProposal?.meta || {});
  const data = metadata.map(([key, value]) => {
    if ([keys.proposer, keys.beneficiary].includes(key)) {
      return [capitalize(key), <User add={value} fontSize={14} key="user" />];
    } else if ([keys.value, keys.bond].includes(key)) {
      return [capitalize(key), <SymbolBalance value={value} key="balance" />];
    } else {
      return [capitalize(key), value];
    }
  });

  return <KVList title="Metadata" data={data} showFold />;
}
