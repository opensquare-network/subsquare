import Tabs from "next-common/components/tabs";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import { TitleContainer } from "../../styled/containers/titleContainer";
import SalesHistoryPurchase from "./purchase";
import SalesHistoryRenewal from "./renewal";
import { useState } from "react";

export default function CoretimeSalesHistorySection() {
  const [activeTabLabel, setActiveTabLabel] = useState("Purchase");

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
              label: "Purchase",
              content: <SalesHistoryPurchase />,
            },
            {
              label: "Renewal",
              content: <SalesHistoryRenewal />,
            },
          ]}
        />
      </NeutralPanel>
    </div>
  );
}
