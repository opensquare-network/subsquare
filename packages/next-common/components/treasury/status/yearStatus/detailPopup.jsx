import Popup from "next-common/components/popup/wrapper/Popup";
import { isNil } from "lodash-es";
import { useState } from "react";
import Tabs from "next-common/components/tabs";
import useYearDetail, { useYearSummary } from "../hooks/useYearDetail";
import Loading from "next-common/components/loading";
import YearDetailSummary from "./yearDetailSummary";

export default function YearStatusDetailPopup({ selectedYear, onClose }) {
  const { yearDetail, loading } = useYearDetail(selectedYear?.label);

  if (isNil(selectedYear)) {
    return null;
  }

  return (
    <Popup title={`Year ${selectedYear?.label} details`} onClose={onClose}>
      <YearStatusDetailContent yearDetail={yearDetail} loading={loading} />
    </Popup>
  );
}

function YearStatusDetailContent({ yearDetail, loading }) {
  const { summary, tabs } = useYearSummary(yearDetail);

  if (loading) {
    return (
      <div className="flex justify-center">
        <Loading size={24} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <YearDetailSummary summary={summary} />
      {tabs.length > 0 && <YearDetailTabs tabs={tabs} />}
    </div>
  );
}

function YearDetailTabs({ tabs }) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.value);

  return (
    <Tabs
      tabs={tabs}
      activeTabValue={activeTabId}
      onTabClick={(tab) => setActiveTabId(tab.value)}
    />
  );
}
