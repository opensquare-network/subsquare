"use client";

import React from "react";
import SelfVotes from "./selfVotes";
import DelegationVotes from "./delegationVotes";

export default function VotesInfoGroup({ data, delegations }) {
  return (
    <div className="flex gap-x-12 max-sm:gap-y-4 max-sm:flex-col">
      <SelfVotes data={data} />
      <DelegationVotes data={data} delegations={delegations} />
    </div>
  );
}
