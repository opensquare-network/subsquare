import { OnChainProxiesProvider } from "next-common/context/proxy";
import ProxyListTabs from "./common/listTabs";
import { MyProxiesProvider } from "./context/myProxies";

export default function Proxy() {
  return (
    <div className="ml-6">
      <OnChainProxiesProvider>
        <MyProxiesProvider>
          <ProxyListTabs />
        </MyProxiesProvider>
      </OnChainProxiesProvider>
    </div>
  );
}
