import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubFellowshipCoreMember from "next-common/hooks/fellowship/core/useSubFellowshipCoreMember";

export default function useSubMyCoreMember() {
  const address = useRealAddress();
  const { isLoading, member } = useSubFellowshipCoreMember(
    address,
    "ambassadorCore",
  );
  return { isLoading, member: member };
}
