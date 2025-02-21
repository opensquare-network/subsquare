import ProxyExplorerTable from "./table";
import { AllProxiesProvider } from "next-common/components/data/context/allProxies";
import CommonHeader from "../common/header";

export default function ProxyExplorer() {
  return (
    <>
      <AllProxiesProvider>
        <CommonHeader href="https://wiki.polkadot.network/docs/learn-proxies" />
        <ProxyExplorerTable />
      </AllProxiesProvider>
    </>
  );
}
