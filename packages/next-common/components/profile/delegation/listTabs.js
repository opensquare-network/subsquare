import { ModuleTab } from "../votingHistory/common";
import DelegatedVotes from "./delegatedVotes";
import BeenDelegated from "./beenDelegated";
import useProfileAddress from "../useProfileAddress";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageUrlTabs from "next-common/components/pageTabs/pageUrlTabs";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";

export default function ListTabs() {
  const address = useProfileAddress();
  const maybeEvmAddress = tryConvertToEvmAddress(address);

  const router = useRouter();
  const prefix = `/user/${maybeEvmAddress}/delegation`;
  const tab = router.asPath.replace(prefix, "");

  useEffect(() => {
    if (tab === "" || tab === "/") {
      router.push(
        {
          pathname: `/user/${maybeEvmAddress}/delegation/received`,
        },
        undefined,
        { shallow: true },
      );
    }
  }, [maybeEvmAddress, router, tab]);

  return (
    <div className="ml-[24px]">
      <PageUrlTabs
        tabs={[
          {
            url: `/user/${maybeEvmAddress}/delegation/received`,
            name: "Received",
            content: <BeenDelegated />,
            extra: <ModuleTab />,
          },
          {
            url: `/user/${maybeEvmAddress}/delegation/delegated`,
            name: "Delegations",
            content: <DelegatedVotes />,
            extra: <ModuleTab />,
          },
        ]}
      />
    </div>
  );
}
