import React from "react";
import KVList from "../../listInfo/kvList";
import capitalize from "../../../utils/capitalize";
import SymbolBalance from "../../values/symbolBalance";
import AddressUser from "next-common/components/user/addressUser";

const keys = {
  proposer: "proposer",
  beneficiary: "beneficiary",
  value: "value",
  bond: "bond",
};

export default function TreasuryProposalMetadata({ treasuryProposal = {} }) {
  const id = treasuryProposal?.proposalIndex;
  const meta = treasuryProposal?.meta || {};
  const metadata = Object.entries(meta);
  metadata.unshift(["id", `#${id}`]);

  let proposer = meta.proposer;
  if (treasuryProposal.isByGov2 && treasuryProposal.proposer) {
    proposer = treasuryProposal.proposer;
  }

  const data = metadata.map(([key, value]) => {
    if (keys.proposer === key) {
      return [capitalize(key), <AddressUser add={proposer} key="user" />];
    } else if ([keys.proposer, keys.beneficiary].includes(key)) {
      return [capitalize(key), <AddressUser add={value} key="user" />];
    } else if ([keys.value, keys.bond].includes(key)) {
      return [capitalize(key), <SymbolBalance value={value} key="balance" />];
    } else {
      return [capitalize(key), value];
    }
  });

  return <KVList title="Metadata" data={data} showFold />;
}
