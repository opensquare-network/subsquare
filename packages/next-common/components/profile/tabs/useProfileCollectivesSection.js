import { usePageProps } from "next-common/context/page";
import { useFellowshipCollectiveCoreMember } from "next-common/hooks/fellowship/collective/useFellowshipCollectiveCoreMember";

export function useProfileCollectivesSection() {
  const { id: address } = usePageProps();
  const fellowshipCoreMember = useFellowshipCollectiveCoreMember(address);
  const ambassadorCoreMember = useFellowshipCollectiveCoreMember(
    address,
    "ambassadorCore",
  );

  if (fellowshipCoreMember) {
    return "fellowship";
  } else if (ambassadorCoreMember) {
    return "ambassador";
  }

  return null;
}
