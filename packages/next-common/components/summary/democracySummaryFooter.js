import Column from "../styled/column";
import DemocracyBeenDelegated from "./democracyBeenDelegated";
import DemocracySummaryDelegation from "./democracySummaryDelegation";

export default function DemocracySummaryFooter() {
  return (
    <Column gap={8}>
      <DemocracySummaryDelegation />
      <DemocracyBeenDelegated />
    </Column>
  );
}
