import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import { useOnchainData } from "..";
import useSubFellowshipCoreMember from "next-common/hooks/fellowship/core/useSubFellowshipCoreMember";
import { find } from "lodash-es";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { useMemo } from "react";

export function useReferendumFellowshipMember() {
  const pallet = useCoreFellowshipPallet();
  const { members, loading: isMembersLoading } = useFellowshipCoreMembers();

  const onchainData = useOnchainData();

  const { call } = onchainData?.inlineCall || onchainData.proposal || {};
  const who = find(call?.args, { name: "who" })?.value;

  const { member: statusFromStorage, isLoading } = useSubFellowshipCoreMember(
    who,
    pallet,
  );

  const member = useMemo(() => {
    if (isLoading || isMembersLoading || !who) {
      return null;
    }

    const m = find(members, { address: who });

    return {
      ...m,
      status: statusFromStorage || m?.status || {},
    };
  }, [isLoading, isMembersLoading, members, statusFromStorage, who]);

  return {
    member,
    isLoading,
  };
}
