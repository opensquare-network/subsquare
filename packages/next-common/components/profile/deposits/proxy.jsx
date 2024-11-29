import DepositTemplate from "next-common/components/myDeposits/depositTemplate";
import useProfileOnChainProxies from "next-common/components/profile/proxy/hooks/useProfileOnChainProxies";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { MenuProxy } from "@osn/icons/subsquare";
import { MapDataList } from "next-common/components/dataList";
import { defaultPageSize } from "next-common/utils/constants";
import { useEffect, useState } from "react";
import {
  delegateeColumn,
  typeColumn,
  useDelayBlockOrTimeColumn,
} from "next-common/components/profile/proxy/common/columns";
import usePaginationComponent from "next-common/components/pagination/usePaginationComponent";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

export function useProfileProxyDepositsData() {
  const address = useProfileAddress();
  const { proxies = [], loading } = useProfileOnChainProxies(address);
  const total = proxies[0]?.length || 0;
  return {
    items: proxies[0],
    loading,
    total,
    balance: proxies[1] ?? 0,
  };
}

function TotalBalance({ balance }) {
  const { decimals, symbol } = useChainSettings();

  if (balance === 0) {
    return null;
  }

  return (
    <div className="inline-flex items-center h-8 mr-3">
      <ValueDisplay
        className="text14Medium"
        value={toPrecision(balance, decimals)}
        symbol={symbol}
      />
    </div>
  );
}

export default function ProxyDeposits({ deposits }) {
  const { items, total, loading, balance } = deposits;

  const [dataList, setDataList] = useState([]);
  const { page, component: pageComponent } = usePaginationComponent(
    total,
    defaultPageSize,
  );
  const delayBlockOrTimeColumn = useDelayBlockOrTimeColumn();
  const columns = [delegateeColumn, typeColumn, delayBlockOrTimeColumn];

  useEffect(() => {
    if (loading) {
      return;
    }

    const startIndex = (page - 1) * defaultPageSize;
    const endIndex = startIndex + defaultPageSize;
    setDataList(items?.slice(startIndex, endIndex));
  }, [items, page, loading]);

  return (
    <DepositTemplate
      activeCount={total}
      loading={loading}
      name="Proxy"
      icon={<MenuProxy />}
      extra={<TotalBalance balance={balance} />}
    >
      <MapDataList
        loading={loading}
        noDataText="No proxy set"
        columnsDef={columns}
        data={dataList}
      />
      {total > 0 && pageComponent}
    </DepositTemplate>
  );
}
