import { useMemo } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { useFellowshipCollectiveMembers } from "./core/useFellowshipCollectiveMembers";

export function useFellowshipCanInductMember() {
  const { members } = useFellowshipCollectiveMembers();
  const realAddress = useRealAddress();

  return useMemo(() => {
    const found = (members || []).find((m) =>
      isSameAddress(m.address, realAddress),
    );
    return found && found.rank >= 3;
  }, [members, realAddress]);
}
