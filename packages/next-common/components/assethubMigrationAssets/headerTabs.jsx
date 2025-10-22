import Tabs from "next-common/components/tabs";
import { useAssetsTab } from "./context/assetsTab";

const TABS = Object.freeze([
  {
    value: "account",
    label: "Account",
  },
  {
    value: "assets",
    label: "Assets",
  },
  {
    value: "foreign_assets",
    label: "Foreign Assets",
  },
]);

export default function HeaderTabs() {
  const { activeValue, setActiveValue } = useAssetsTab();

  return (
    <div className="space-y-4 px-12 max-w-[1200px] max-sm:px-6 mx-auto">
      <Tabs
        activeTabValue={activeValue}
        tabs={TABS}
        tabsContentClassName="hidden"
        onTabClick={(tab) => {
          setActiveValue(tab.value);
        }}
      />
    </div>
  );
}
