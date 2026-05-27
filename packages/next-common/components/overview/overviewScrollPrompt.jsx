import { useMemo, useState } from "react";
import { TreasuryProvider } from "next-common/context/treasury";
import ScrollPromptContainer from "next-common/components/overview/accountInfo/components/ScrollPromptContainer";
import ConfirmingReferendaStats from "./confirmingReferendaStats";
import CoretimeStats from "./coretimeStats";
import useTreasurySpendUpcomingItems from "./accountInfo/components/upcomingEventsPrompt/sources/treasurySpend";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { colorStyle, PromptTypes } from "next-common/components/scrollPrompt";
import { SystemClose } from "@osn/icons/subsquare";

function SpendItemRow({ item, onClose }) {
  return (
    <GreyPanel
      className="text14Medium py-2.5 px-4 justify-between"
      style={colorStyle[PromptTypes.NEUTRAL]}
    >
      <div className="flex flex-wrap items-center gap-x-0">{item.content}</div>
      <SystemClose
        className="w-5 h-5 shrink-0 ml-2"
        role="button"
        onClick={onClose}
      />
    </GreyPanel>
  );
}

function OverviewScrollPromptContent() {
  const spendItems = useTreasurySpendUpcomingItems();
  const [closedIds, setClosedIds] = useState(new Set());

  const visibleSpendItems = useMemo(
    () => spendItems.filter((item) => !closedIds.has(item.id)),
    [spendItems, closedIds],
  );

  const components = useMemo(() => {
    const spendComponents = visibleSpendItems.map((item) => {
      function SpendItem() {
        return (
          <SpendItemRow
            item={item}
            onClose={() => setClosedIds((prev) => new Set([...prev, item.id]))}
          />
        );
      }
      return SpendItem;
    });
    return [ConfirmingReferendaStats, CoretimeStats, ...spendComponents];
  }, [visibleSpendItems]);

  return <ScrollPromptContainer components={components} pageSize={3} />;
}

export default function OverviewScrollPrompt() {
  return (
    <TreasuryProvider>
      <OverviewScrollPromptContent />
    </TreasuryProvider>
  );
}
