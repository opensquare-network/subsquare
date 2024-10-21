import Tabs from "next-common/components/tabs";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import { TitleContainer } from "../../styled/containers/titleContainer";
import SalesHistoryPurchases from "./purchases";
import SalesHistoryRenewals from "./renewals";
import { useState } from "react";
import { usePageProps } from "next-common/context/page";

export default function CoretimeSalesHistorySection() {
  const { purchaseCount, renewalCount } = usePageProps();
  const [activeTabLabel, setActiveTabLabel] = useState("Purchases");

  return (
    <div>
      <TitleContainer className="mb-4">Sales History</TitleContainer>
      <NeutralPanel className="p-6">
        <Tabs
          activeTabLabel={activeTabLabel}
          onTabClick={(tab) => {
            setActiveTabLabel(tab.label);
          }}
          tabs={[
            {
              label: "Renewals",
              activeCount: renewalCount,
              content: <SalesHistoryRenewals />,
            },
            {
              label: "Purchases",
              activeCount: purchaseCount,
              content: <SalesHistoryPurchases />,
            },
          ]}
        />
      </NeutralPanel>
    </div>
  );
}
