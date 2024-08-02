import { usePageProps } from "next-common/context/page";
import { useIsAmbassadorCoreMember } from "next-common/hooks/ambassador/core/useIsAmbassadorCoreMember";
import { useIsFellowshipCoreMember } from "next-common/hooks/fellowship/core/useIsFellowshipCoreMember";

export function useProfileCollectivesSection() {
  const { id: address } = usePageProps();
  const isFellowshipCoreMember = useIsFellowshipCoreMember(address);
  const isAmbassadorCoreMember = useIsAmbassadorCoreMember(address);

  if (isFellowshipCoreMember) {
    return "fellowship";
  } else if (isAmbassadorCoreMember) {
    return "ambassador";
  }

  return null;
}
