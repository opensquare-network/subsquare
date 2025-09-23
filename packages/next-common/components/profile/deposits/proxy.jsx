import DepositTemplate from "next-common/components/myDeposits/depositTemplate";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { MenuProxy } from "@osn/icons/subsquare";
import { MapDataList } from "next-common/components/dataList";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  delegateeColumn,
  typeColumn,
  useDelayBlockOrTimeColumn,
} from "next-common/components/profile/proxy/common/columns";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { setProfileProxyDeposits } from "next-common/store/reducers/profile/deposits/proxy";
import { isNil } from "lodash-es";
import { useContextApi } from "next-common/context/api";

export function useProfileProxyDepositsData() {
  const api = useContextApi();
  const dispatch = useDispatch();
  const address = useProfileAddress();

  useEffect(() => {
    if (!api || !address || !api.query?.proxy?.proxies) {
      return;
    }
    api?.query.proxy?.proxies(address).then((result) => {
      const proxies = result.toJSON() || [];
      const total = proxies[0]?.length || 0;
      const balance = proxies[1] ?? 0;

      return dispatch(
        setProfileProxyDeposits({ items: proxies[0], total, balance }),
      );
    });
    return () => {
      dispatch(setProfileProxyDeposits(null));
    };
  }, [api, address, dispatch]);
}

export function TotalBalance({ balance }) {
  const { decimals, symbol } = useChainSettings();

  if (balance === 0) {
    return null;
  }

  return (
    <div className="inline-flex items-center h-8 mr-3">
      <ValueDisplay
        className="text14Medium text-textPrimary"
        value={toPrecision(balance, decimals)}
        symbol={symbol}
      />
    </div>
  );
}

export default function ProxyDeposits({ deposits }) {
  const { items, total, loading, balance } = deposits || {};

  const [dataList, setDataList] = useState([]);
  const delayBlockOrTimeColumn = useDelayBlockOrTimeColumn();
  const columns = [delegateeColumn, typeColumn, delayBlockOrTimeColumn];

  useEffect(() => {
    if (loading) {
      return;
    }

    setDataList(items);
  }, [items, loading]);

  if (isNil(deposits)) {
    return null;
  }

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
    </DepositTemplate>
  );
}
