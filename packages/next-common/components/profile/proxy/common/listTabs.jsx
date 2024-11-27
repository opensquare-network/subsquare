import MyProxies from "../myProxies";
import ReceivedProxies from "../received";
import useProfileAddress from "../../useProfileAddress";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import PageUrlTabs from "next-common/components/pageTabs/pageUrlTabs";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useMyProxiesContext } from "../context/myProxies";
import { useReceivedProxiesContext } from "../context/received";

export default function ProxyListTabs() {
  const { total: myProxiesCount, loading: isMyProxiesLoading } =
    useMyProxiesContext();
  const { total: receivedProxiesCount, loading: isReceivedProxiesLoading } =
    useReceivedProxiesContext();

  const address = useProfileAddress();
  const maybeEvmAddress = useMemo(
    () => tryConvertToEvmAddress(address),
    [address],
  );

  const router = useRouter();
  const prefix = `/user/${maybeEvmAddress}/proxies`;
  const tab = router.asPath.replace(prefix, "");

  useEffect(() => {
    if (!tab || tab === "/") {
      router.push(`${prefix}/mine`, undefined, {
        shallow: true,
      });
    }
  }, [tab, maybeEvmAddress, router, prefix]);

  const tabs = useMemo(
    () => [
      {
        url: `${prefix}/mine`,
        name: (
          <div className="inline-flex items-center space-x-1 ml-6">
            <span>My Proxies</span>
            {!isMyProxiesLoading && (
              <span className="text16Medium text-textTertiary">
                {myProxiesCount}
              </span>
            )}
          </div>
        ),
        content: <MyProxies />,
      },
      {
        url: `${prefix}/received`,
        name: (
          <div className="inline-flex items-center space-x-1">
            <span>Received</span>
            {!isReceivedProxiesLoading && (
              <span className="text16Medium text-textTertiary">
                {receivedProxiesCount}
              </span>
            )}
          </div>
        ),
        content: <ReceivedProxies />,
      },
    ],
    [
      prefix,
      myProxiesCount,
      isMyProxiesLoading,
      receivedProxiesCount,
      isReceivedProxiesLoading,
    ],
  );

  return <PageUrlTabs tabs={tabs} />;
}
