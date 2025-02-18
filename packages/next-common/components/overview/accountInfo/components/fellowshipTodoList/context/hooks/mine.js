import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useContextMembers } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/members";
import { useMemo } from "react";
import { isSameAddress } from "next-common/utils";

export default function useContextMyMember() {
  const realAddress = useRealAddress();
  const members = useContextMembers();

  return useMemo(
    () => (members || []).find((m) => isSameAddress(m.address, realAddress)),
    [realAddress, members],
  );
}

export function useContextIsMember() {
  const member = useContextMyMember();
  return !!member;
}
