import React from "react";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import DemocracySummaryFooter from "./summary/democracySummaryFooter";
import DemocracySummaryKusama from "./summary/democracySummaryKusama";
import DemocracySummary from "./summary/democracySummary";

export default function MaybeNoDemocracySummary({ summary }) {
  const chain = useChain();
  const isKusama = chain === Chains.kusama;

  let summaryPanel = <DemocracySummary footer={<DemocracySummaryFooter />} />;
  if (isKusama) {
    summaryPanel = <DemocracySummaryKusama summary={summary} />;
  }

  return summaryPanel;
}
