import MyProxies from "../myProxies";
import RecievedProxies from "../recieved";
import useProfileAddress from "../../useProfileAddress";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import PageUrlTabs from "next-common/components/pageTabs/pageUrlTabs";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useMyProxiesContext } from "../context/myProxies";

export default function ProxyListTabs() {
  const { total: proxiesCount, loading: isMyProxiesLoading } =
    useMyProxiesContext();
  const address = useProfileAddress();
  const maybeEvmAddress = useMemo(
    () => tryConvertToEvmAddress(address),
    [address],
  );

  const router = useRouter();
  const prefix = `/user/${maybeEvmAddress}/proxy`;
  const tab = router.asPath.replace(prefix, "");

  useEffect(() => {
    if (!tab || tab === "/") {
      router.push(`${prefix}/my`, undefined, {
        shallow: true,
      });
    }
  }, [tab, maybeEvmAddress, router, prefix]);

  const tabs = useMemo(
    () => [
      {
        url: `${prefix}/my`,
        name: (
          <div className="inline-flex items-center space-x-1 ml-6">
            <span>My Proxies</span>
            {!isMyProxiesLoading && (
              <span className="text16Medium text-textTertiary">
                {proxiesCount}
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
            {/* TODO: recieved proxies count */}
            <span className="text16Medium text-textTertiary">{null}</span>
          </div>
        ),
        content: <RecievedProxies />,
      },
    ],
    [prefix, proxiesCount, isMyProxiesLoading],
  );

  return <PageUrlTabs tabs={tabs} />;
}
