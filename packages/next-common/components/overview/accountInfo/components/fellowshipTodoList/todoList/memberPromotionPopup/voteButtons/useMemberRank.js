import useCollectiveMember from "../../../hooks/useCollectiveMember";

export default function useMemberRank(address) {
  const { member, isLoading } = useCollectiveMember(address);
  const rank = member?.rank;

  return { rank, isLoading };
}
