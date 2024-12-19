import ProxyExplorerTable from "./table";
import { AllProxiesProvider } from "next-common/components/data/context/allProxies";
import ProxyExplorerHeader from "./header";

export default function ProxyExplorer() {
  return (
    <>
      <AllProxiesProvider>
        <ProxyExplorerHeader />
        <ProxyExplorerTable />
      </AllProxiesProvider>
    </>
  );
}
