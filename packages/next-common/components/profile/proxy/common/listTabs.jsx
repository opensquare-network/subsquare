import MyProxies from "../myProxies";
import ReceivedProxies from "../received";
import useProfileAddress from "../../useProfileAddress";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useMyProxiesContext } from "../context/myProxies";
import { useReceivedProxiesContext } from "../context/received";
import Tabs from "next-common/components/tabs";
import { cn } from "next-common/utils";

function TabTitle({ active, children }) {
  return (
    <div
      className={cn(
        "text16Bold",
        active ? "text-textPrimary" : "text-textTertiary",
      )}
    >
      {children}
    </div>
  );
}

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
        value: "/mine",
        label({ active }) {
          return <TabTitle active={active}>My Proxies</TabTitle>;
        },
        activeCount: !isMyProxiesLoading && myProxiesCount,
        url: `${prefix}/mine`,
        shallow: true,
        content: <MyProxies />,
      },
      {
        value: "/received",
        label({ active }) {
          return <TabTitle active={active}>Received</TabTitle>;
        },
        activeCount: !isReceivedProxiesLoading && receivedProxiesCount,
        url: `${prefix}/received`,
        shallow: true,
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

  return (
    <Tabs
      activeTabValue={tab}
      tabs={tabs}
      tabsListDivider={false}
      tabsContentClassName="-ml-6"
    />
  );
}
