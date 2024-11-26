import MyProxies from "./myProxies";
import RecievedProxies from "./recieved";
import useProfileAddress from "../useProfileAddress";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import PageUrlTabs from "next-common/components/pageTabs/pageUrlTabs";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";

export default function Proxy() {
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
      router.push(`${prefix}/received`, undefined, {
        shallow: true,
      });
    }
  }, [tab, maybeEvmAddress, router, prefix]);

  const tabs = useMemo(
    () => [
      {
        url: `${prefix}/myProxies`,
        name: "My Proxies",
        content: <MyProxies />,
      },
      {
        url: `${prefix}/received`,
        name: "Received",
        content: <RecievedProxies />,
      },
    ],
    [prefix],
  );

  return (
    <div className="ml-6">
      <PageUrlTabs tabs={tabs} />
    </div>
  );
}
