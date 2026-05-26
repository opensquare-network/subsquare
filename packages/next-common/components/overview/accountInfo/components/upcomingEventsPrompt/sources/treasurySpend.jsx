import { useMemo } from "react";
import Link from "next/link";
import { useAsync } from "react-use";
import { useChainSettings } from "next-common/context/chain";
import { TreasuryProvider } from "next-common/context/treasury";
import usePendingSpends from "next-common/hooks/treasury/usePendingSpends";
import { fetchTreasuryItemData } from "next-common/services/treasuryItemsData";
import Tooltip from "next-common/components/tooltip";
import { UpcomingEventsSource } from "../context";

const SOURCE = "treasury-spend";
const EMPTY_EVENTS = [];

function getSpendTag(type) {
  return type === "valid" ? "Valid" : "Expire";
}

function getSpendActionText(type) {
  return type === "valid" ? "valid" : "expired";
}

function TreasurySpendEventContent({ spend }) {
  const { value: data } = useAsync(
    () => fetchTreasuryItemData("treasury/spends", spend.index),
    [spend.index],
  );

  const title = data?.title?.trim() || `Treasury spend #${spend.index}`;

  return (
    <>
      <Tooltip content={title}>
        <Link
          className="text-theme500"
          href={`/treasury/spends/${spend.index}`}
        >
          Treasury spend #{spend.index}
        </Link>
      </Tooltip>
      <span>
        &nbsp;will be {getSpendActionText(spend.type)} in{" "}
        {spend.estimatedBlocksTime}
      </span>
    </>
  );
}

function useTreasurySpendUpcomingEvents() {
  const { pendingSpendCountdowns } = usePendingSpends();

  return useMemo(() => {
    return pendingSpendCountdowns.map((spend) => ({
      id: `${SOURCE}-${spend.type}-${spend.index}-${spend.targetHeight}`,
      source: SOURCE,
      tag: getSpendTag(spend.type),
      timeLeftMs: spend.timeLeftMs,
      content: <TreasurySpendEventContent spend={spend} />,
    }));
  }, [pendingSpendCountdowns]);
}

function TreasurySpendUpcomingEventsRegistrar() {
  const events = useTreasurySpendUpcomingEvents();

  return <UpcomingEventsSource source={SOURCE} events={events} />;
}

export default function TreasurySpendUpcomingEventsSource() {
  const { modules } = useChainSettings();

  if (!modules?.treasury?.spends) {
    return <UpcomingEventsSource source={SOURCE} events={EMPTY_EVENTS} />;
  }

  return (
    <TreasuryProvider>
      <TreasurySpendUpcomingEventsRegistrar />
    </TreasuryProvider>
  );
}
