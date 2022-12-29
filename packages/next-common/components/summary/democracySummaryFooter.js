import React from "react";
import VStack from "../styled/vStack";
import DemocracyBeenDelegated from "./democracyBeenDelegated";
import DemocracySummaryDelegation from "./democracySummaryDelegation";

export default function DemocracySummaryFooter() {
  return (
    <VStack space={8}>
      <DemocracySummaryDelegation />
      <DemocracyBeenDelegated />
    </VStack>
  );
}
