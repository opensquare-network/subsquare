import DepositTemplate from "next-common/components/myDeposits/depositTemplate";
import { MenuProxy } from "@osn/icons/subsquare";
import { MapDataList } from "next-common/components/dataList";
import { useEffect, useState } from "react";
import {
  delegateeColumn,
  typeColumn,
  useDelayBlockOrTimeColumn,
  removeColumn,
} from "next-common/components/myProxies/common/columns";
import { useMyProxiesContext } from "next-common/components/myProxies/context/myProxies";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { TotalBalance } from "next-common/components/profile/deposits/proxy";

export default function MyProxyDeposits({ deposits }) {
  const { proxies, loading, balance, total } = deposits;

  const [dataList, setDataList] = useState([]);
  const delayBlockOrTimeColumn = useDelayBlockOrTimeColumn();
  const columns = [
    delegateeColumn,
    typeColumn,
    delayBlockOrTimeColumn,
    removeColumn,
  ];

  useEffect(() => {
    if (loading) {
      return;
    }

    setDataList(proxies);
  }, [proxies, loading, dataList]);

  return (
    <DepositTemplate
      activeCount={total}
      loading={loading}
      name="Proxy"
      icon={<MenuProxy />}
      extra={<TotalBalance balance={balance} />}
    >
      <SignerPopupWrapper>
        <MapDataList
          loading={loading}
          noDataText="No proxy set"
          columnsDef={columns}
          data={dataList}
        />
      </SignerPopupWrapper>
    </DepositTemplate>
  );
}

export function useMyProxyDeposits() {
  const { proxies, loading, balance, total } = useMyProxiesContext();

  return {
    proxies,
    loading,
    balance,
    total,
  };
}
