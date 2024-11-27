import ProxyListTabs from "./common/listTabs";
import { MyProxiesProvider } from "./context/myProxies";
import { ReceivedProxiesProvider } from "./context/received";

export default function Proxy() {
  return (
    <div className="ml-6">
      <ReceivedProxiesProvider>
        <MyProxiesProvider>
          <ProxyListTabs />
        </MyProxiesProvider>
      </ReceivedProxiesProvider>
    </div>
  );
}
