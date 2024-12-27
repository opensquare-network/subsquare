import useSubStorage from "next-common/hooks/common/useSubStorage";

export function useFellowshipMemberRank(
  address,
  pallet = "fellowshipCollective",
) {
  const { result } = useSubStorage(pallet, "members", [address]);
  if (result && result.isSome) {
    return result.unwrap().rank.toNumber();
  } else {
    return null;
  }
}
