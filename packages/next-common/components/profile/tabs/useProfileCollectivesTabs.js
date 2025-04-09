import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import useSubFellowshipCoreMember from "next-common/hooks/fellowship/core/useSubFellowshipCoreMember";
import { TabTitle } from "./";

export function useProfileCollectivesTabs() {
  const chain = useChain();
  const address = useProfileAddress();
  const { member: fellowshipMember } = useSubFellowshipCoreMember(address);
  const { member: ambassadorMember } = useSubFellowshipCoreMember(
    address,
    "ambassadorCore",
  );

  if (!isCollectivesChain(chain)) {
    return [];
  }

  const tabs = [];
  if (fellowshipMember) {
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
