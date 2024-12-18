import ProxyExplorerTable from "./table";
import { AllProxiesProvider } from "next-common/components/data/context/allProxies";

export default function ProxyExplorer() {
  return (
    <>
      <AllProxiesProvider>
        <ProxyExplorerTable />
      </AllProxiesProvider>
    </>
  );
}
