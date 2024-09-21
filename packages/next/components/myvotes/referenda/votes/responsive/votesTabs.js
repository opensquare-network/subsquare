import TabsList from "next-common/components/tabs/tabsList";
import { useRouter } from "next/router";
import { useMemo } from "react";

export const MyVoted = "my-voted";
export const ActiveProposals = "active-proposals";

function useOnchainVotesSubTabs() {
  const { pathname } = useRouter();
  return useMemo(() => {
    const path = pathname.split("/").filter(Boolean)[0];
    return [
      { id: MyVoted, label: "My Voted", url: `/${path}/votes` },
      {
        id: ActiveProposals,
        label: "Active Proposals",
        url: `/${path}/votes/active-proposals`,
      },
    ];
  }, [pathname]);
}

export default function OnchainVotesSubTab() {
  const onchainVotesSubTabs = useOnchainVotesSubTabs();
  return (
    <div className="border-b border-neutral300 mb-[16px]">
      <TabsList isUrlTabs tabs={onchainVotesSubTabs} />
    </div>
  );
}

export function useCurrentOnchainVotesSubTab() {
  const onchainVotesSubTabs = useOnchainVotesSubTabs();
  const { pathname } = useRouter();
  const currentTab = onchainVotesSubTabs.find((tab) => tab.url === pathname);
  return currentTab.id;
}
