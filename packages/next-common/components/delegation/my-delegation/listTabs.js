import { ModuleTab } from "next-common/components/profile/votingHistory/common";
import DelegatedVotes from "./delegatedVotes";
import BeenDelegated from "./beenDelegated";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
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

export default function ListTabs() {
  const address = useRealAddress();

  const router = useRouter();
  const prefix = "/delegation/mine";
  const tab = router.asPath.replace(prefix, "");

  useEffect(() => {
    if (tab === "" || tab === "/") {
      router.push(
        {
          pathname: "/delegation/mine/received",
        },
        undefined,
        { shallow: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, tab]);

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
            url: "/delegation/mine/received",
            shallow: true,
            content: <BeenDelegated />,
            extra: <ModuleTab />,
          },
          {
            value: "/delegations",
            label({ active }) {
              return <TabTitle active={active}>Delegations</TabTitle>;
            },
            url: "/delegation/mine/delegations",
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
