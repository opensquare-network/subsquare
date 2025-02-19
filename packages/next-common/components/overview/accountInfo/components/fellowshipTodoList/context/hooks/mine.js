import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";
import { isSameAddress } from "next-common/utils";
import { useContextMembers } from "../members";

export default function useContextMyMember() {
  const realAddress = useRealAddress();
  const { members } = useContextMembers();

  return useMemo(
    () => (members || []).find((m) => isSameAddress(m.address, realAddress)),
    [realAddress, members],
  );
}

export function useIsMember() {
  const member = useContextMyMember();
  return member && member.rank > 0;
}

export function useIsCandidate() {
  const member = useContextMyMember();
  return member && member.rank === 0;
}
