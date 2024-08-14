import { useChain } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import { useFellowshipCollectiveCoreMember } from "next-common/hooks/fellowship/collective/useFellowshipCollectiveCoreMember";
import { isCollectivesChain } from "next-common/utils/chain";

export function useProfileCollectivesTabs() {
  const chain = useChain();
  const { id: address } = usePageProps();
  const fellowshipCoreMember = useFellowshipCollectiveCoreMember(address);
  const ambassadorCoreMember = useFellowshipCollectiveCoreMember(
    address,
    "ambassadorCore",
  );

  if (!isCollectivesChain(chain)) {
    return [];
  }

  return [
    fellowshipCoreMember && {
      label: "Fellowship",
      url: `/user/${address}/fellowship`,
      exactMatch: false,
    },
    ambassadorCoreMember && {
      label: "Ambassador",
      url: `/user/${address}/ambassador`,
      exactMatch: false,
    },
  ].filter(Boolean);
}
