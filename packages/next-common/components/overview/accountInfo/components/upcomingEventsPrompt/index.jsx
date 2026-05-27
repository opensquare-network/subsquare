import { useMemo } from "react";
import { TreasuryProvider } from "next-common/context/treasury";
import useTreasurySpendUpcomingItems from "./sources/treasurySpend";
import UpcomingEventsPanel from "./panel";

function compareByTime(a, b) {
  return (
    (a.timeLeftMs ?? Number.MAX_SAFE_INTEGER) -
    (b.timeLeftMs ?? Number.MAX_SAFE_INTEGER)
  );
}

function UpcomingEventsContent() {
  const treasurySpendItems = useTreasurySpendUpcomingItems();

  const items = useMemo(
    () => [...treasurySpendItems].sort(compareByTime),
    [treasurySpendItems],
  );

  return <UpcomingEventsPanel items={items} />;
}

export default function UpcomingEventsPrompt() {
  return (
    <TreasuryProvider>
      <UpcomingEventsContent />
    </TreasuryProvider>
  );
}
