import DepositTemplate from "next-common/components/myDeposits/depositTemplate";
import useProfileOnChainProxies from "next-common/components/profile/proxy/hooks/useProfileOnChainProxies";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { MenuProxy } from "@osn/icons/subsquare";

export function useProfileProxyDepositsData() {
  const address = useProfileAddress();
  const { proxies = [], loading } = useProfileOnChainProxies(address);
  const total = proxies[0]?.length || 0;
  const proxyDeposits = {
    items: proxies,
    loading,
    total,
  };
  return proxyDeposits;
}
// TODO: tableList columns
export default function ProxyDeposits({ deposits }) {
  const { total, loading } = deposits;
  return (
    <div>
      <DepositTemplate
        activeCount={total}
        loading={loading}
        name="Proxy"
        icon={<MenuProxy />}
      >
        proxy table.
      </DepositTemplate>
    </div>
  );
}
