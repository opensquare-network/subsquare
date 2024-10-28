import Tabs from "next-common/components/tabs";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import { TitleContainer } from "../../styled/containers/titleContainer";
import SalesHistoryPurchases from "./purchases";
import SalesHistoryRenewals from "./renewals";
import { useState } from "react";
import { usePageProps } from "next-common/context/page";
import useCoretimeSalePhase, {
  Phases,
} from "next-common/context/coretime/hooks/useCoretimeSalePhase";
import Loading from "next-common/components/loading";

function SalesHistoryWrapper({ children }) {
  return (
    <div>
      <TitleContainer className="mb-4">Sales History</TitleContainer>
      <NeutralPanel className="p-6">{children}</NeutralPanel>
    </div>
  );
}

function SalesHistoryList({ phase }) {
  const { coretimeSale } = usePageProps();

  const isInterludePhase = phase === Phases.Interlude;

  const [activeTabLabel, setActiveTabLabel] = useState(
    isInterludePhase ? "Purchases" : "Renewals",
  );

  const renewalsTabInfo = {
    label: "Renewals",
    activeCount: coretimeSale?.renewalCount,
    content: <SalesHistoryRenewals />,
  };

  const purchasesTabInfo = {
    label: "Purchases",
    activeCount: coretimeSale?.purchaseCount,
    content: <SalesHistoryPurchases />,
  };

  const tabs = isInterludePhase
    ? [purchasesTabInfo, renewalsTabInfo]
    : [renewalsTabInfo, purchasesTabInfo];

  return (
    <Tabs
      activeTabLabel={activeTabLabel}
      onTabClick={(tab) => {
        setActiveTabLabel(tab.label);
      }}
      tabs={tabs}
    />
  );
}

export default function CoretimeSalesHistorySection() {
  const { isLoading, phase } = useCoretimeSalePhase();

  if (isLoading) {
    return (
      <SalesHistoryWrapper>
        <div className="flex items-center justify-center">
          <Loading size={20} />
        </div>
      </SalesHistoryWrapper>
    );
  }

  return (
    <SalesHistoryWrapper>
      <SalesHistoryList phase={phase} />
    </SalesHistoryWrapper>
  );
}
