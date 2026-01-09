import Popup from "next-common/components/popup/wrapper/Popup";
import { isNil } from "lodash-es";
import { useState } from "react";
import Tabs from "next-common/components/tabs";
import useYearDetail, { useYearSummary } from "../hooks/useYearDetail";
import LoadableContent from "next-common/components/common/loadableContent";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";

export default function YearStatusDetailPopup({ selectedYear, onClose }) {
  const { yearDetail, loading } = useYearDetail(selectedYear?.label);

  if (isNil(selectedYear) || isNil(yearDetail)) {
    return null;
  }

  return (
    <Popup title={`Year ${selectedYear?.label} details`} onClose={onClose}>
      <LoadableContent size={20} isLoading={loading}>
        <YearStatusDetailContent yearDetail={yearDetail} />
      </LoadableContent>
    </Popup>
  );
}

function YearStatusDetailContent({ yearDetail }) {
  const { summary, tabs } = useYearSummary(yearDetail);
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.value);

  return (
    <div className="flex flex-col gap-4">
      <SummaryLayout>
        <SummaryItem title="Total">
          <ValueDisplay
            value={toPrecision(summary.total)}
            symbol=""
            prefix="$"
          />
        </SummaryItem>
        {summary.bounties > 0 && (
          <SummaryItem title="Bounties">
            <ValueDisplay
              value={toPrecision(summary.bounties)}
              symbol=""
              prefix="$"
            />
          </SummaryItem>
        )}
        {summary.proposals > 0 && (
          <SummaryItem title="Proposals">
            <ValueDisplay
              value={toPrecision(summary.proposals)}
              symbol=""
              prefix="$"
            />
          </SummaryItem>
        )}
        {summary.spends > 0 && (
          <SummaryItem title="Spends">
            <ValueDisplay
              value={toPrecision(summary.spends)}
              symbol=""
              prefix="$"
            />
          </SummaryItem>
        )}
        {summary.tips > 0 && (
          <SummaryItem title="Tips">
            <ValueDisplay
              value={toPrecision(summary.tips)}
              symbol=""
              prefix="$"
            />
          </SummaryItem>
        )}
        {summary.childBounties > 0 && (
          <SummaryItem title="Child Bounties">
            <ValueDisplay
              value={toPrecision(summary.childBounties)}
              symbol=""
              prefix="$"
            />
          </SummaryItem>
        )}
      </SummaryLayout>
      <Tabs
        tabs={tabs}
        activeTabValue={activeTabId}
        onTabClick={(tab) => setActiveTabId(tab.value)}
      />
    </div>
  );
}
