import { ModuleTab } from "next-common/components/profile/votingHistory/common";
import DelegatedVotes from "./delegatedVotes";
import BeenDelegated from "./beenDelegated";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageUrlTabs from "next-common/components/pageTabs/pageUrlTabs";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function ListTabs() {
  const address = useRealAddress();

  const router = useRouter();
  const prefix = "/delegation/my-delegation";
  const tab = router.asPath.replace(prefix, "");

  useEffect(() => {
    if (tab === "" || tab === "/") {
      router.push(
        {
          pathname: "/delegation/my-delegation/received",
        },
        undefined,
        { shallow: true },
      );
    }
  }, [address, tab]);

  return (
    <div className="ml-[24px]">
      <PageUrlTabs
        tabs={[
          {
            url: "/delegation/my-delegation/received",
            name: "Received",
            content: <BeenDelegated />,
            extra: <ModuleTab />,
          },
          {
            url: "/delegation/my-delegation/delegations",
            name: "Delegations",
            content: <DelegatedVotes />,
            extra: <ModuleTab />,
          },
        ]}
      />
    </div>
  );
}
