import useCollectiveMember from "../../../hooks/useCollectiveMember";

export default function useMemberRank(address) {
  const me = useCollectiveMember(address);
  return me?.rank;
}
