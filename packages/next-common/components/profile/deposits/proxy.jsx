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

export function useProfileProxyDepositsData() {
  const address = useProfileAddress();
  const { proxies = [], loading } = useProfileOnChainProxies(address);
  const total = proxies[0]?.length || 0;
  const proxyDeposits = {
    items: proxies[0],
    loading,
    total,
  };
  return proxyDeposits;
}

export default function ProxyDeposits({ deposits }) {
  const { items, total, loading } = deposits;

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
