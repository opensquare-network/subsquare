import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { TabTitle } from "./";
import { usePageProps } from "next-common/context/page";

export function useProfileCollectivesTabs() {
  const chain = useChain();
  const address = useProfileAddress();
  const {
    fellowshipMembers = [],
    ambassadorMembers = [],
    fellowshipInductedFeeds,
  } = usePageProps();
  if (!isCollectivesChain(chain)) {
    return [];
  }

  const fellowshipMember = fellowshipMembers.find(
    (member) => member.address === address,
  );
  const ambassadorMember = ambassadorMembers.find(
    (member) => member.address === address,
  );

  const isHistoryMember = fellowshipInductedFeeds?.items?.length > 0;

  const tabs = [];
  if (fellowshipMember || isHistoryMember) {
    tabs.push({
      label({ active }) {
        return <TabTitle active={active}>Fellowship</TabTitle>;
      },
      value: "fellowship",
      url: `/user/${address}/fellowship`,
      exactMatch: false,
    });
  }
  if (ambassadorMember) {
    tabs.push({
      label({ active }) {
        return <TabTitle active={active}>Ambassador</TabTitle>;
      },
      value: "ambassador",
      url: `/user/${address}/ambassador`,
      exactMatch: false,
    });
  }

  return tabs;
}
