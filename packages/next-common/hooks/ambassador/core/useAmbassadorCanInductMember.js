import { useSelector } from "react-redux";
import { ambassadorCollectiveMembersSelector } from "next-common/store/reducers/ambassador/collective";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";
import { isSameAddress } from "next-common/utils";

export default function useAmbassadorCanInductMember() {
  const members = useSelector(ambassadorCollectiveMembersSelector);
  const realAddress = useRealAddress();
  return useMemo(() => {
    const found = (members || []).find((m) =>
      isSameAddress(m.address, realAddress),
    );
    return !!found;
  }, [members, realAddress]);
}
