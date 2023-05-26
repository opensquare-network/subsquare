import React from "react";
import { useChainSettings } from "next-common/context/chain";
import DemocracySummaryFooter from "./summary/democracySummaryFooter";
import DemocracySummaryKusama from "./summary/democracySummaryKusama";
import DemocracySummary from "./summary/democracySummary";

export default function MaybeNoDemocracySummary({ summary }) {
  const { hasDemocracy } = useChainSettings();

  let summaryPanel = <DemocracySummary footer={<DemocracySummaryFooter />} />;
  if (hasDemocracy === false) {
    summaryPanel = <DemocracySummaryKusama summary={summary} />;
  }

  return summaryPanel;
}
