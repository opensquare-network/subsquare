import DataBaseLayout from "./common/baseLayout";
import CommonTabs from "./common/tabs";
import ProxyExplorer from "./proxies";
import MultisigExplorer from "./multisig";
import RecoveryExplorer from "./recovery";

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

export function DataMultisig() {
  return (
    <DataPageWithLayout>
      <MultisigExplorer />
    </DataPageWithLayout>
  );
}

export function DataRecovery() {
  return (
    <DataPageWithLayout>
      <RecoveryExplorer />
    </DataPageWithLayout>
  );
}
