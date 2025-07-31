import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { TabTitle } from "./";
import { usePageProps } from "next-common/context/page";
import { EmptyList } from "next-common/utils/constants";

function useShowFellowshipTab() {
  const address = useProfileAddress();
  const { fellowshipMembers = [], fellowshipFeeds = EmptyList } =
    usePageProps();
  const fellowshipMember = fellowshipMembers?.find(
    (member) => member.address === address,
  );
  const isFellowshipHistoryMember = fellowshipFeeds?.items?.length > 0;

  return fellowshipMember || isFellowshipHistoryMember;
}

function useShowAmbassadorTab() {
  const address = useProfileAddress();
  const { ambassadorMembers = [], ambassadorFeeds = EmptyList } =
    usePageProps();
  const ambassadorMember = ambassadorMembers?.find(
    (member) => member.address === address,
  );
  const isAmbassadorHistoryMember = ambassadorFeeds?.items?.length > 0;

  return ambassadorMember || isAmbassadorHistoryMember;
}

export function useProfileCollectivesTabs() {
  const chain = useChain();
  const address = useProfileAddress();
  const showFellowshipTab = useShowFellowshipTab();
  const showAmbassadorTab = useShowAmbassadorTab();

  if (!isCollectivesChain(chain)) {
    return [];
  }

  const tabs = [];
  if (showFellowshipTab) {
    tabs.push({
      label({ active }) {
        return <TabTitle active={active}>Fellowship</TabTitle>;
      },
      value: "fellowship",
      url: `/user/${address}/fellowship`,
      exactMatch: false,
    });
  }
  if (showAmbassadorTab) {
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
