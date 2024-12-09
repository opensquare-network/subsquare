import { ModuleTab } from "../votingHistory/common";
import DelegatedVotes from "./delegatedVotes";
import BeenDelegated from "./beenDelegated";
import useProfileAddress from "../useProfileAddress";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { cn } from "next-common/utils";
import Tabs from "next-common/components/tabs";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maybeEvmAddress, tab]);

  return (
    <div className="ml-[24px]">
      <Tabs
        activeTabValue={tab}
        tabs={[
          {
            value: "/received",
            label({ active }) {
              return <TabTitle active={active}>Received</TabTitle>;
            },
            url: `/user/${maybeEvmAddress}/delegation/received`,
            shallow: true,
            content: <BeenDelegated />,
            extra: <ModuleTab />,
          },
          {
            value: "/delegated",
            label({ active }) {
              return <TabTitle active={active}>Delegations</TabTitle>;
            },
            url: `/user/${maybeEvmAddress}/delegation/delegated`,
            shallow: true,
            content: <DelegatedVotes />,
            extra: <ModuleTab />,
          },
        ]}
        tabsListDivider={false}
      />
    </div>
  );
}
