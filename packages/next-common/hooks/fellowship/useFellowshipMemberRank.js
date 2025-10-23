import { useFellowshipMember } from "./useFellowshipMember";

export function useFellowshipMemberRank(
  address,
  pallet = "fellowshipCollective",
) {
  const { member, isLoading } = useFellowshipMember(address, pallet);
  if (member && member.isSome) {
    const rank = member.unwrap().rank.toNumber();
    return {
      rank,
      isLoading,
    };
  }

  return {
    rank: null,
    isLoading,
  };
}
