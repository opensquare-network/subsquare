import React from "react";
import { getNode, toPrecision } from "@subsquare/next/utils";
import KVList from "../../listInfo/kvList";
import capitalize from "../../../utils/capitalize";
import UserWithLink from "../../user/userWithLink";

const keys = {
  proposer: "proposer",
  beneficiary: "beneficiary",
  value: "value",
  bond: "bond",
};

export default function TreasuryProposalMetadata({ chain, treasuryProposal }) {
  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  const metadata = Object.entries(treasuryProposal?.meta || {});
  const data = metadata.map(([key, value]) => {
    if ([keys.proposer, keys.beneficiary].includes(key)) {
      return [capitalize(key), <UserWithLink address={value} chain={chain} />];
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
