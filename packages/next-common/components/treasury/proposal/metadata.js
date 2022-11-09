import React from "react";
import KVList from "../../listInfo/kvList";
import capitalize from "../../../utils/capitalize";
import { toPrecision } from "../../../utils";
import User from "../../user";
import { useChainSettings } from "../../../context/chain";

const keys = {
  proposer: "proposer",
  beneficiary: "beneficiary",
  value: "value",
  bond: "bond",
};

export default function TreasuryProposalMetadata({ treasuryProposal }) {
  const { decimals, symbol } = useChainSettings();
  const metadata = Object.entries(treasuryProposal?.meta || {});
  const data = metadata.map(([key, value]) => {
    if ([keys.proposer, keys.beneficiary].includes(key)) {
      return [capitalize(key), <User add={value} fontSize={14} />];
    } else if ([keys.value, keys.bond].includes(key)) {
      return [
        capitalize(key),
        `${toPrecision(value ?? 0, decimals)} ${symbol}`,
      ];
    } else {
      return [capitalize(key), value];
    }
  });

  return <KVList title="Metadata" data={data} showFold />;
}
