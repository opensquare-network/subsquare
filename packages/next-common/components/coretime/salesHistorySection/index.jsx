import Tabs from "next-common/components/tabs";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import { TitleContainer } from "../../styled/containers/titleContainer";
import SalesHistoryPurchases from "./purchases";
import SalesHistoryRenewals from "./renewals";
import { useEffect, useState } from "react";
import useCoretimeSaleIsInterlude from "next-common/context/coretime/hooks/useCoretimeSaleIsInterlude";
import useCoretimeSale from "next-common/context/coretime/sale/provider";

function SalesHistoryWrapper({ children }) {
  return (
    <div>
      <TitleContainer className="mb-4">Sales History</TitleContainer>
      <NeutralPanel className="p-6">{children}</NeutralPanel>
    </div>
  );
}

function SalesHistoryList() {
  const sale = useCoretimeSale();
  const { isInterludePhase, isLoading } = useCoretimeSaleIsInterlude();
  const [activeTabLabel, setActiveTabLabel] = useState("");

  useEffect(() => {
    if (isLoading) {
      return;
    }

    setActiveTabLabel(isInterludePhase ? "Renewals" : "Purchases");
  }, [isInterludePhase, isLoading]);

  const renewalsTabInfo = {
    label: "Renewals",
    activeCount: sale?.renewalCount,
    content: <SalesHistoryRenewals />,
  };

  const purchasesTabInfo = {
    label: "Purchases",
    activeCount: sale?.purchaseCount,
    content: <SalesHistoryPurchases />,
  };

  const tabs = isInterludePhase
    ? [renewalsTabInfo, purchasesTabInfo]
    : [purchasesTabInfo, renewalsTabInfo];

  return (
    <Tabs
      activeTabLabel={activeTabLabel}
      onTabClick={(tab) => {
        setActiveTabLabel(tab.label);
      }}
      tabs={isLoading ? [] : tabs}
    />
  );
}

export default function CoretimeSalesHistorySection() {
  return (
    <SalesHistoryWrapper>
      <SalesHistoryList />
    </SalesHistoryWrapper>
  );
}
