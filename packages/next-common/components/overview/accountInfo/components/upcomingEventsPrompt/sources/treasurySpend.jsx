import { useMemo } from "react";
import Link from "next/link";
import { useAsync } from "react-use";
import { useChainSettings } from "next-common/context/chain";
import useSpendCountdowns from "next-common/hooks/treasury/useSpendCountdowns";
import { fetchTreasuryItemData } from "next-common/services/treasuryItemsData";
import Tooltip from "next-common/components/tooltip";

const SOURCE = "treasury-spend";

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
          className="font-bold underline"
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

export default function useTreasurySpendUpcomingItems() {
  const { modules } = useChainSettings();
  const { spendCountdowns } = useSpendCountdowns();

  return useMemo(() => {
    if (!modules?.treasury?.spends) {
      return [];
    }

    return spendCountdowns.map((spend) => ({
      id: `${SOURCE}-${spend.type}-${spend.index}-${spend.targetHeight}`,
      tag: getSpendTag(spend.type),
      timeLeftMs: spend.timeLeftMs,
      content: <TreasurySpendEventContent spend={spend} />,
    }));
  }, [modules?.treasury?.spends, spendCountdowns]);
}
