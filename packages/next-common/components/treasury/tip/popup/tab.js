import Tab from "../../../tab";

export const ReportAwesome = "ReportAwesome";
export const NewTip = "NewTip";

export default function TipTab({ tabIndex, setTabIndex }) {
  return (
    <Tab
      tabs={[
        {
          tabId: ReportAwesome,
          tabTitle: "Report Awesome",
        },
        {
          tabId: NewTip,
          tabTitle: "New Tip",
        },
      ]}
      selectedTabId={tabIndex}
      setSelectedTabId={setTabIndex}
    />
  );
}
