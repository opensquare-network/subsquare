import useConditionalSubStorage from "next-common/hooks/common/useConditionalSubStorage";

export function useFellowshipMember(address, pallet = "fellowshipCollective") {
  const { result: member, loading: isLoading } = useConditionalSubStorage(
    pallet,
    "members",
    [address],
  );
  return {
    member,
    isLoading,
  };
}
