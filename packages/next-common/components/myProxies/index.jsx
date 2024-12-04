import AccountSubTabs from "next-common/components/overview/account/subTabs";
import MyProxiesSummary from "./summary";
import { ReceivedProxiesProvider } from "./context/received";
import ProxyListTabs from "./common/listTabs";
import { MyProxiesProvider } from "./context/myProxies";

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
