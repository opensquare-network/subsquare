import { useMemo } from "react";
import { TreasuryProvider } from "next-common/context/treasury";
import ScrollPromptContainer from "next-common/components/overview/accountInfo/components/ScrollPromptContainer";
import CoretimeStats from "./coretimeStats";
import useTreasurySpendUpcomingItems from "./accountInfo/components/upcomingEventsPrompt/sources/treasurySpend";
import useReferendaUpcomingItems from "./accountInfo/components/upcomingEventsPrompt/sources/referenda";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { colorStyle, PromptTypes } from "next-common/components/scrollPrompt";
import { SystemClose } from "@osn/icons/subsquare";
import { ReferendaPalletProvider } from "next-common/context/referenda/pallet";
import { OnChainReferendaProvider } from "next-common/context/onchainReferenda";

function SpendItemRow({ item, onClose }) {
  return (
    <GreyPanel
      className="text14Medium py-2.5 px-4 justify-between"
      style={colorStyle[PromptTypes.NEUTRAL]}
    >
      <div className="flex flex-wrap items-center gap-x-0">{item.content}</div>
      {onClose && (
        <SystemClose
          className="w-5 h-5 shrink-0 ml-2"
          role="button"
          onClick={onClose}
        />
      )}
    </GreyPanel>
  );
}

function OverviewScrollPromptContent() {
  const spendItems = useTreasurySpendUpcomingItems();
  const referendaItems = useReferendaUpcomingItems();

  const components = useMemo(() => {
    const allItems = [...spendItems, ...referendaItems].sort(
      (a, b) => a.timeLeftMs - b.timeLeftMs,
    );
    const itemComponents = allItems.map((item) => {
      function PromptItem() {
        return <SpendItemRow item={item} />;
      }
      return PromptItem;
    });
    return [CoretimeStats, ...itemComponents];
  }, [spendItems, referendaItems]);

  return <ScrollPromptContainer components={components} pageSize={3} />;
}

export default function OverviewScrollPrompt() {
  return (
    <TreasuryProvider>
      <ReferendaPalletProvider>
        <OnChainReferendaProvider>
          <OverviewScrollPromptContent />
        </OnChainReferendaProvider>
      </ReferendaPalletProvider>
    </TreasuryProvider>
  );
}
