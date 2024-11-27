import ProxyListTabs from "./common/listTabs";
import { MyProxiesProvider } from "./context/myProxies";
import { RecievedProxiesProvider } from "./context/recieved";

export default function Proxy() {
  return (
    <div className="ml-6">
      <RecievedProxiesProvider>
        <MyProxiesProvider>
          <ProxyListTabs />
        </MyProxiesProvider>
      </RecievedProxiesProvider>
    </div>
  );
}
