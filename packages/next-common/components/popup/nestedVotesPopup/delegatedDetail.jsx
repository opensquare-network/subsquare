"use client";

import React from "react";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import { noop } from "lodash-es";
import VotesInfoGroup from "./votesInfoGroup";
import DelegationsList from "./delegationsList";

export default function NestedPopupDelegatedDetailPopup({
  data,
  onClose = noop,
}) {
  return (
    <BaseVotesPopup title="Delegated Detail" onClose={onClose}>
      <VotesInfoGroup data={data} delegations={data.directVoterDelegations} />
      <DelegationsList delegations={data.directVoterDelegations} />
    </BaseVotesPopup>
  );
}
