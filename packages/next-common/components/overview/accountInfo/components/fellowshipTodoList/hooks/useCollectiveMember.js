import { useMemo } from "react";
import { useContextCollectivesMembers } from "../context/collectivesMember";

export default function useCollectiveMember(address) {
  const { members: collectiveMembers, isLoading } =
    useContextCollectivesMembers();
  const member = useMemo(
    () => collectiveMembers.find((m) => m.address === address),
    [collectiveMembers, address],
  );

  return { member, isLoading };
}
