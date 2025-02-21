import DataBaseLayout from "./common/baseLayout";
import CommonTabs from "./common/tabs";
import ProxyExplorer from "./proxies";
import VestingExplorer from "./vesting";

function DataPageWithLayout({ children }) {
  return (
    <DataBaseLayout>
      <CommonTabs />
      {children}
    </DataBaseLayout>
  );
}

export function DataProxies() {
  return (
    <DataPageWithLayout>
      <ProxyExplorer />
    </DataPageWithLayout>
  );
}

export function DataVesting() {
  return (
    <DataPageWithLayout>
      <VestingExplorer />
    </DataPageWithLayout>
  );
}
