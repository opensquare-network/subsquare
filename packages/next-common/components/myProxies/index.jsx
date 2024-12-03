import AccountSubTabs from "next-common/components/overview/account/subTabs";
import MyProxiesSummary from "./summary";
import { ReceivedProxiesProvider } from "./context/received";
import ProxyListTabs from "./common/listTabs";
import {
  fetchMyProxies,
  myProxiesSelector,
} from "next-common/store/reducers/myProxiesSlice";
import { useSelector, useDispatch } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useContextApi } from "next-common/context/api";
import { useEffect } from "react";

export default function MyProxies() {
  const myProxies = useSelector(myProxiesSelector);
  const dispatch = useDispatch();
  const address = useRealAddress();
  const api = useContextApi();

  useEffect(() => {
    dispatch(fetchMyProxies(address, api));
  }, [dispatch, address, api]);

  return (
    <div className="space-y-6">
      <ReceivedProxiesProvider>
        <AccountSubTabs className="mx-6" />
        <MyProxiesSummary myProxies={myProxies} />
        <div className="space-y-6">
          <ProxyListTabs myProxies={myProxies} />
        </div>
      </ReceivedProxiesProvider>
    </div>
  );
}
