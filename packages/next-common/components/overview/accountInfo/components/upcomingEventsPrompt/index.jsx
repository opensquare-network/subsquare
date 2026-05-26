import { UpcomingEventsProvider } from "./context";
import UpcomingEventsPanel from "./panel";
import TreasurySpendUpcomingEventsSource from "./sources/treasurySpend";

export default function UpcomingEventsPrompt() {
  return (
    <UpcomingEventsProvider>
      <TreasurySpendUpcomingEventsSource />
      <UpcomingEventsPanel />
    </UpcomingEventsProvider>
  );
}
