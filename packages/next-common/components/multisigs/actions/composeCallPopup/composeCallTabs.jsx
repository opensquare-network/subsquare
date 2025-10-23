import Tab from "next-common/components/tab";

const tabs = [
  {
    tabId: "set",
    tabTitle: "Set Call Data",
  },
  {
    tabId: "input",
    tabTitle: "Input Call Hex",
  },
];

export default function ComposeCallTabs({ formType, setFormType }) {
  return (
    <Tab tabs={tabs} selectedTabId={formType} setSelectedTabId={setFormType} />
  );
}
