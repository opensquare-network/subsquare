import React from "react";
import Link from "next/link";

export default function extractTreasuryFields(call = {}) {
  const { section, method, args = [] } = call;
  if (
    "treasury" !== section ||
    !["approveProposal", "rejectProposal"].includes(method)
  ) {
    return [];
  }

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
