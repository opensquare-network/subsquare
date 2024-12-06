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
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useMyProxiesContext } from "next-common/components/myProxies/context/myProxies";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";

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

export default function MyProxyDeposits() {
  const { proxies, loading, balance, total } = useMyProxiesContext();

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
  const { total } = useMyProxiesContext();

  return {
    total,
    component: <MyProxyDeposits />,
  };
}
