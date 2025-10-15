import Tabs from "next-common/components/tabs";
import { useAssetsTab } from "./context/assetsTab";

const TABS = Object.freeze([
  {
    value: "overview",
    label: "Overview",
  },
  {
    value: "assets",
    label: "Assets",
  },
  {
    value: "foreignAssets",
    label: "Foreign Assets",
  },
]);

export default function HeaderTabs() {
  const { activeValue, setActiveValue } = useAssetsTab();

  return (
    <Tabs
      activeTabValue={activeValue}
      tabs={TABS}
      tabsContentClassName="hidden"
      tabsListClassName="px-12 max-w-[1200px] max-sm:px-6 mx-auto"
      onTabClick={(tab) => {
        setActiveValue(tab.value);
      }}
    />
  );
}
