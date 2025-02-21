import ProxyExplorerTable from "./table";
import { AllProxiesProvider } from "next-common/components/data/context/allProxies";
import PageHeader from "../common/pageHeader";

export default function ProxyExplorer() {
  return (
    <>
      <AllProxiesProvider>
        <PageHeader href="https://wiki.polkadot.network/docs/learn-proxies" />
        <ProxyExplorerTable />
      </AllProxiesProvider>
    </>
  );
}
