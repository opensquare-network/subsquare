import AccountSubTabs from "next-common/components/overview/account/subTabs";
import MyProxiesSummary from "./summary";
import { ReceivedProxiesProvider } from "./context/received";
import { MyProxiesProvider } from "./context/myProxies";
import ProxyListTabs from "./common/listTabs";

export default function MyProxies() {
  return (
    <div className="space-y-6">
      <ReceivedProxiesProvider>
        <MyProxiesProvider>
          <AccountSubTabs className="mx-6" />
          <MyProxiesSummary />
          <div className="space-y-6">
            <ProxyListTabs />
          </div>
        </MyProxiesProvider>
      </ReceivedProxiesProvider>
    </div>
  );
}
