import { useMemo } from "react";
import { useSelector } from "react-redux";
import { fellowshipCollectiveMembersSelector } from "next-common/store/reducers/fellowship/collective";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";

export function useFellowshipCanInductMember() {
  const members = useSelector(fellowshipCollectiveMembersSelector);
  const realAddress = useRealAddress();

  const canInduct = useMemo(() => {
    const found = (members || []).find((m) =>
      isSameAddress(m.address, realAddress),
    );
    return found && found.rank >= 3;
  }, [members, realAddress]);

  return canInduct;
}
