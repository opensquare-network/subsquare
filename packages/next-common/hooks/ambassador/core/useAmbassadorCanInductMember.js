import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";
import { isSameAddress } from "next-common/utils";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";

export default function useAmbassadorCanInductMember() {
  const { members } = useFellowshipCollectiveMembers();
  const realAddress = useRealAddress();
  return useMemo(() => {
    const found = (members || []).find((m) =>
      isSameAddress(m.address, realAddress),
    );
    return !!found;
  }, [members, realAddress]);
}
