import { useChain } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import { useIsAmbassadorCoreMember } from "next-common/hooks/ambassador/core/useIsAmbassadorCoreMember";
import { useIsFellowshipCoreMember } from "next-common/hooks/fellowship/core/useIsFellowshipCoreMember";
import { isCollectivesChain } from "next-common/utils/chain";

export function useProfileCollectivesTabs() {
  const chain = useChain();
  const { id: address } = usePageProps();
  const isFellowshipCoreMember = useIsFellowshipCoreMember(address);
  const isAmbassadorCoreMember = useIsAmbassadorCoreMember(address);

  if (!isCollectivesChain(chain)) {
    return [];
  }

  return [
    isFellowshipCoreMember && {
      label: "Fellowship",
      url: `/user/${address}/fellowship`,
      exactMatch: false,
    },
    isAmbassadorCoreMember && {
      label: "Ambassador",
      url: `/user/${address}/ambassador`,
      exactMatch: false,
    },
  ].filter(Boolean);
}
