import { ModuleTab } from "../votingHistory/common";
import DelegatedVotes from "./delegatedVotes";
import BeenDelegated from "./beenDelegated";
import useProfileAddress from "../useProfileAddress";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PageUrlTabs from "next-common/components/pageTabs/pageUrlTabs";

export default function ListTabs() {
  const address = useProfileAddress();

  const router = useRouter();
  const prefix = `/user/${address}/delegation`;
  const tab = router.asPath.replace(prefix, "");

  useEffect(() => {
    if (tab === "" || tab === "/") {
      router.push(
        {
          pathname: `/user/${address}/delegation/delegated`,
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
            url: `/user/${address}/delegation/delegated`,
            name: "Delegated Votes",
            content: <DelegatedVotes />,
            extra: <ModuleTab />,
          },
          {
            url: `/user/${address}/delegation/been-delegated`,
            name: "Been Delegated",
            content: <BeenDelegated />,
            extra: <ModuleTab />,
          },
        ]}
      />
    </div>
  );
}
